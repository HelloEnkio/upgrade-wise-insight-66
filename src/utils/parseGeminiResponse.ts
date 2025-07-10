import { jsonrepair } from 'jsonrepair';

export function parseGeminiResponse(response: any): any {
  const parts = response?.candidates?.[0]?.content?.parts;
  const finishReason = response?.candidates?.[0]?.finishReason;

  let text: string | undefined;
  if (Array.isArray(parts)) {
    for (const part of parts) {
      if (typeof part.text === 'string') {
        text = part.text;
        break;
      }
    }
  }

  if (finishReason === 'MAX_TOKENS' || !text) {
    console.error('Gemini response truncated:', JSON.stringify(response));
    throw new Error('Gemini response truncated due to token limit');
  }

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in Gemini response');
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
      throw new Error('Erreur lors du traitement de la réponse IA');
    }
  }
}
