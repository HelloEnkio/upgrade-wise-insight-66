
import { sanitizeInput } from '@/utils/sanitize';
import { parseGeminiResponse } from '@/utils/parseGeminiResponse';
import { GeminiParseError, GeminiTokenLimitError } from '@/utils/geminiErrors';

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
  private dailyRequestCount: number = 0;
  private lastResetDate: string = '';
  private readonly MAX_DAILY_REQUESTS = 490; // Sécurité: 490 au lieu de 500
  // Utilise le modèle Gemini 2.5 Flash en version gratuite
  private readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  private readonly ADMIN_EMAIL = 'votre-email@example.com'; // Email pour les alertes

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

  private checkDailyLimit(): boolean {
    const today = new Date().toISOString().split('T')[0];
    
    // Reset counter if it's a new day
    if (this.lastResetDate !== today) {
      this.resetDailyCounter();
    }

    const limitReached = this.dailyRequestCount >= this.MAX_DAILY_REQUESTS;
    
    if (limitReached) {
      this.logQuotaAlert();
    }
    
    return !limitReached;
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

  private incrementRequestCount() {
    this.dailyRequestCount++;
    localStorage.setItem('gemini_daily_count', this.dailyRequestCount.toString());
    
    const percentageUsed = Math.round((this.dailyRequestCount / this.MAX_DAILY_REQUESTS) * 100);
    console.log(`📊 Utilisation Gemini: ${this.dailyRequestCount}/${this.MAX_DAILY_REQUESTS} (${percentageUsed}%)`);
    
    // Alerte préventive à 80%
    if (percentageUsed >= 80 && percentageUsed < 90) {
      console.warn('⚠️ Attention: 80% du quota Gemini utilisé');
    }
    
    // Alerte critique à 90%
    if (percentageUsed >= 90) {
      console.error('🔥 CRITIQUE: 90% du quota Gemini utilisé - Limite proche!');
    }
  }

  private async callGeminiAPI(prompt: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Clé API Gemini non configurée côté serveur - Contactez l\'administrateur');
    }

    if (!this.checkDailyLimit()) {
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
          maxOutputTokens: 2048,
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

    this.incrementRequestCount();
    return json;
  }

  async getProductComparison(currentDevice: string, newDevice: string): Promise<any> {
    const safeCurrent = sanitizeInput(currentDevice);
    const safeNew = sanitizeInput(newDevice);
    const prompt = `Compare these two devices and provide a detailed analysis:

Current device: ${safeCurrent}
New device: ${safeNew}

Please respond with a JSON object containing:
- recommendation: "upgrade" | "keep" | "maybe"
- score: number (0-100)
- reasons: array of strings explaining the recommendation
- specs: array of comparison specs with category, current, new, and improvement
- technicalSpecs: detailed technical comparison

Focus on performance, features, value, and user experience. Be objective and helpful.`;

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

  async getProductSpecs(productName: string): Promise<any> {
    const safeName = sanitizeInput(productName);
    const prompt = `Provide detailed technical specifications for: ${safeName}

Please respond with a JSON object containing comprehensive specs including:
- Basic specifications
- Performance metrics
- Features
- Technical details
- Release information

Be accurate and comprehensive.`;

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
