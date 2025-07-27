
import { sanitizeInput } from '@/utils/sanitize';
import { parseGeminiResponse } from '@/utils/parseGeminiResponse';
import { GeminiParseError, GeminiTokenLimitError } from '@/utils/geminiErrors';
import { simplifyCategory } from '@/utils/simplifyCategory';
import { normalizeConnoisseurSpecs } from './specNormalizer';

interface GeminiRequest {
  currentDevice: string;
  newDevice: string;
}

interface SpecsRequest {
  productName: string;
}

class GeminiServiceClass {
  // Clé API chargée depuis les variables d'environnement (Vite)
  private apiKey: string = import.meta.env.VITE_GEMINI_API_KEY ?? '';
  private backendUrl: string = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3001';
  private dailyRequestCount: number = 0;
  private lastResetDate: string = '';
  private readonly MAX_DAILY_REQUESTS = 490; // Sécurité: 490 au lieu de 500
  // Utilise le modèle Gemini 2.5 Flash en version gratuite
  private readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  private readonly ADMIN_EMAIL = 'votre-email@example.com'; // Email pour les alertes
  private readonly maxOutputTokens: number = parseInt(
    import.meta.env.VITE_GEMINI_MAX_OUTPUT_TOKENS ?? '4096',
    10
  );

  constructor() {
    this.initializeCounters();
    console.log('Gemini key loaded:', Boolean(this.apiKey));
  }

  private initializeCounters() {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('gemini_last_reset');
    const storedCount = localStorage.getItem('gemini_daily_count');
    
    if (storedDate === today && storedCount) {
      this.dailyRequestCount = parseInt(storedCount, 10);
      this.lastResetDate = today;
    } else {
      this.resetDailyCounter();
    }
  }

  private resetDailyCounter() {
    const today = new Date().toISOString().split('T')[0];
    this.dailyRequestCount = 0;
    this.lastResetDate = today;
    localStorage.setItem('gemini_daily_count', '0');
    localStorage.setItem('gemini_last_reset', today);
    console.log('🔄 Compteur quotidien réinitialisé pour:', today);
  }

  private async refreshUsage() {
    try {
      const res = await fetch(`${this.backendUrl}/api/usage`);
      if (!res.ok) return;
      const data = await res.json();
      this.dailyRequestCount = data.used;
      this.lastResetDate = new Date().toISOString().split('T')[0];
      localStorage.setItem('gemini_daily_count', String(this.dailyRequestCount));
      localStorage.setItem('gemini_last_reset', this.lastResetDate);
    } catch (error) {
      console.warn('Failed to refresh usage from backend', error);
    }
  }

  private async checkBackendQuota(): Promise<boolean> {
    try {
      const res = await fetch(`${this.backendUrl}/api/increment`, { method: 'POST' });
      if (!res.ok) throw new Error('Backend quota check failed');
      const data = await res.json();
      this.dailyRequestCount = data.used;
      this.lastResetDate = new Date().toISOString().split('T')[0];
      localStorage.setItem('gemini_daily_count', String(this.dailyRequestCount));
      localStorage.setItem('gemini_last_reset', this.lastResetDate);
      if (!data.allowed) {
        this.logQuotaAlert();
      }
      return data.allowed;
    } catch (error) {
      console.error('Quota check failed', error);
      throw new Error('Service temporairement indisponible. Réessayez plus tard.');
    }
  }

  private logQuotaAlert() {
    const alertData = {
      timestamp: new Date().toISOString(),
      requestCount: this.dailyRequestCount,
      maxRequests: this.MAX_DAILY_REQUESTS,
      adminEmail: this.ADMIN_EMAIL,
      message: '🚨 ALERTE QUOTA GEMINI ATTEINT'
    };
    
    console.error('🚨 QUOTA ALERT:', alertData);
    
    // Log pour monitoring externe (sera visible dans les logs Lovable)
    console.log('ADMIN_ALERT:', JSON.stringify(alertData));
    
    // Ici, avec Supabase, on pourra envoyer un vrai email d'alerte
    // Pour l'instant, on log de manière très visible
  }

  private logLocalUsage() {
    const percentageUsed = Math.round((this.dailyRequestCount / this.MAX_DAILY_REQUESTS) * 100);
    console.log(`📊 Utilisation Gemini: ${this.dailyRequestCount}/${this.MAX_DAILY_REQUESTS} (${percentageUsed}%)`);

    if (percentageUsed >= 80 && percentageUsed < 90) {
      console.warn('⚠️ Attention: 80% du quota Gemini utilisé');
    }

    if (percentageUsed >= 90) {
      console.error('🔥 CRITIQUE: 90% du quota Gemini utilisé - Limite proche!');
    }
  }

  private async callGeminiAPI(prompt: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Clé API Gemini non configurée côté serveur - Contactez l\'administrateur');
    }

    const allowed = await this.checkBackendQuota();
    if (!allowed) {
      throw new Error(`Service temporairement indisponible. Réessayez demain.`);
    }

    console.log('Gemini request prompt:', prompt);

    const response = await fetch(`${this.GEMINI_API_URL}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          // Limit output length to keep responses concise
          maxOutputTokens: this.maxOutputTokens,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      console.error('❌ Gemini API Error:', response.status, errorData);
      throw new Error(`Service d'analyse temporairement indisponible. Réessayez dans quelques instants.`);
    }

    const json = await response.json();
    console.log('Gemini raw response:', JSON.stringify(json));

    this.logLocalUsage();
    return json;
  }

  /**
   * Ask Gemini whether two product descriptions belong to comparable categories.
   * If the first response says they are not comparable but both categories are
   * identical, the call is retried once with the same prompt. The second result
   * is returned when available, otherwise the initial response is used.
   */
  async checkComparability(
    currentDevice: string,
    newDevice: string
  ): Promise<{ comparable: boolean; category1: string; category2: string }> {
    const safeCurrent = sanitizeInput(currentDevice);
    const safeNew = sanitizeInput(newDevice);
    const prompt = `Determine if the following products are comparable.\n\n- ${safeCurrent}\n- ${safeNew}\n\nReturn a JSON object { "comparable": boolean, "category1": <one-word category>, "category2": <one-word category> }. Use a single-word category such as "smartphone" or "vehicle". Only provide the JSON.`;

    // First attempt
    const response = await this.callGeminiAPI(prompt);
    let result;
    try {
      result = parseGeminiResponse(response);
      result.category1 = simplifyCategory(result.category1);
      result.category2 = simplifyCategory(result.category2);
    } catch (error) {
      console.error('Failed to parse Gemini response', { prompt, response });
      if (error instanceof GeminiParseError || error instanceof GeminiTokenLimitError) {
        throw error;
      }
      throw new GeminiParseError('Unexpected Gemini response');
    }

    // Retry once if Gemini says not comparable but categories match
    if (!result.comparable && result.category1 === result.category2) {
      try {
        const retryResponse = await this.callGeminiAPI(prompt);
        result = parseGeminiResponse(retryResponse);
        result.category1 = simplifyCategory(result.category1);
        result.category2 = simplifyCategory(result.category2);
      } catch (error) {
        console.error('Gemini retry failed', { prompt, error });
        // Fallback to the initial result
      }
    }

    return result;
  }

  async checkDetailCompleteness(
    currentDevice: string,
    newDevice: string
  ): Promise<{
    current: { complete: boolean; missing: string[] };
    new: { complete: boolean; missing: string[] };
  }> {
    const safeCurrent = sanitizeInput(currentDevice);
    const safeNew = sanitizeInput(newDevice);
    const prompt = `For each of the following product descriptions, tell me if it contains enough detail to uniquely identify the model (like model number or release year). List any missing elements.\n\nCurrent: ${safeCurrent}\nNew: ${safeNew}\n\nReturn only JSON in this format:\n{ "current": { "complete": boolean, "missing": string[] }, "new": { "complete": boolean, "missing": string[] } }`;

    const response = await this.callGeminiAPI(prompt);
    try {
      return parseGeminiResponse(response);
    } catch (error) {
      console.error('Failed to parse Gemini response', { prompt, response });
      if (error instanceof GeminiParseError || error instanceof GeminiTokenLimitError) {
        throw error;
      }
      throw new GeminiParseError('Unexpected Gemini response');
    }
  }

  async getProductComparison(currentDevice: string, newDevice: string): Promise<any> {
    const safeCurrent = sanitizeInput(currentDevice);
    const safeNew = sanitizeInput(newDevice);
    const prompt = `Compare these two devices:

Current device: ${safeCurrent}
New device: ${safeNew}

Return a JSON object with:
- recommendation: "upgrade" | "keep" | "maybe"
- score: number (0-100)
- takeHome: short summary of the key points
- connoisseurSpecs: detailed technical comparison with category, current value, new value, improvement, score and details

Focus on performance, features, value and user experience. Only output valid JSON.`;

    const response = await this.callGeminiAPI(prompt);
    try {
      const result = parseGeminiResponse(response);
      if (result && typeof result === 'object') {
        result.connoisseurSpecs = normalizeConnoisseurSpecs(result.connoisseurSpecs);
      }
      return result;
    } catch (error) {
      console.error('Failed to parse Gemini response', { prompt, response });
      if (error instanceof GeminiParseError || error instanceof GeminiTokenLimitError) {
        throw error;
      }
      throw new GeminiParseError('Unexpected Gemini response');
    }
  }

  async getProductSpecs(productName: string): Promise<any> {
    const safeName = sanitizeInput(productName);
    const prompt = `Provide detailed technical specifications for: ${safeName}

Please respond with a JSON object containing comprehensive specs including:
- Basic specifications
- Performance metrics
- Features
- Technical details
- Release information

Be accurate and comprehensive. Limit the JSON response to under 500 tokens.`;

    const response = await this.callGeminiAPI(prompt);
    try {
      return parseGeminiResponse(response);
    } catch (error) {
      console.error('Failed to parse Gemini response', { prompt, response });
      if (error instanceof GeminiParseError || error instanceof GeminiTokenLimitError) {
        throw error;
      }
      throw new GeminiParseError('Unexpected Gemini response');
    }
  }

  async getMultiComparison(products: string[]): Promise<any> {
    const prompt = `Compare the following products and provide an overall analysis table:

${products.join('\n')}

Respond with a JSON object like:
{
  "categories": ["Performance", "Price", "Battery", "Display", "Storage", "Camera"],
  "products": [
    {
      "name": "Product name",
      "scores": { "Performance": 90, "Price": 80, ... },
      "overallScore": 85,
      "recommendation": "Best Choice",
      "affiliateLink": "https://example.com"
    }
  ]
}

Only provide valid JSON.`;

    const response = await this.callGeminiAPI(prompt);
    try {
      return parseGeminiResponse(response);
    } catch (error) {
      console.error('Failed to parse Gemini response', { prompt, response });
      if (error instanceof GeminiParseError || error instanceof GeminiTokenLimitError) {
        throw error;
      }
      throw new GeminiParseError('Unexpected Gemini response');
    }
  }


  getDailyUsage() {
    return {
      used: this.dailyRequestCount,
      remaining: this.MAX_DAILY_REQUESTS - this.dailyRequestCount,
      limit: this.MAX_DAILY_REQUESTS,
      percentage: Math.round((this.dailyRequestCount / this.MAX_DAILY_REQUESTS) * 100)
    };
  }

  isQuotaExceeded(): boolean {
    return this.dailyRequestCount >= this.MAX_DAILY_REQUESTS;
  }
}

export const geminiService = new GeminiServiceClass();
