import { jsonrepair } from 'jsonrepair';
import { GeminiParseError, GeminiTokenLimitError } from './geminiErrors';

export function parseGeminiResponse(response: any): any {
  const firstCandidate = response?.candidates?.[0] ?? {};
  const parts = firstCandidate?.content?.parts;
  let text: string | undefined;
  if (Array.isArray(parts)) {
    for (const part of parts) {
      if (typeof part.text === 'string') {
        text = part.text;
        break;
      }
    }
  }
  if (!text) {
    if (firstCandidate?.finishReason === 'MAX_TOKENS') {
      throw new GeminiTokenLimitError('Response truncated due to token limit');
    }
    console.error('Invalid Gemini response format:', JSON.stringify(response));
    throw new GeminiParseError('Invalid response format from Gemini');
  }

  if (firstCandidate?.finishReason === 'MAX_TOKENS') {
    throw new GeminiTokenLimitError('Response truncated due to token limit');
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    const lower = text.toLowerCase();
    if (lower.includes('token') && lower.includes('limit')) {
      throw new GeminiTokenLimitError('Response truncated due to token limit');
    }
    throw new GeminiParseError('No JSON found in Gemini response');
  }

  const jsonString = jsonMatch[0];
  try {
    return JSON.parse(jsonString);
  } catch {
    try {
      const repaired = jsonrepair(jsonString);
      return JSON.parse(repaired);
    } catch (error) {
      console.error('Error repairing Gemini JSON:', error);
      throw new GeminiParseError('Erreur lors du traitement de la réponse IA');
    }
  }
}
