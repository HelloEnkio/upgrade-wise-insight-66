import { jsonrepair } from 'jsonrepair';

export function parseGeminiResponse(response: any): any {
  const parts = response?.candidates?.[0]?.content?.parts;
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
    throw new Error('Invalid response format from Gemini');
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
