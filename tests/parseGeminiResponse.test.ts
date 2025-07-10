import { describe, it, expect } from 'vitest';
import { parseGeminiResponse } from '../src/utils/parseGeminiResponse';
import { GeminiParseError, GeminiTokenLimitError } from '../src/utils/geminiErrors';

const buildResponse = (text: string) => ({
  candidates: [
    { content: { parts: [{ text }] } }
  ]
});

describe('parseGeminiResponse', () => {
  it('repairs malformed JSON with trailing comma', () => {
    const malformed = `Here is the data:\n{\n  "name": "John",\n  "age": 30,\n}`;
    const response = buildResponse(malformed);
    const result = parseGeminiResponse(response);
    expect(result).toEqual({ name: 'John', age: 30 });
  });

  it('finds the first text part if initial part has no text', () => {
    const response = {
      candidates: [
        {
          content: {
            parts: [
              { inlineData: { data: 'ignored', mimeType: 'text/plain' } },
              { text: '{"ok":true}' }
            ]
          }
        }
      ]
    } as any;
    const result = parseGeminiResponse(response);
    expect(result).toEqual({ ok: true });
  });

  it('throws GeminiParseError when JSON is missing', () => {
    const response = buildResponse('No JSON here');
    expect(() => parseGeminiResponse(response)).toThrow(GeminiParseError);
  });

  it('throws GeminiTokenLimitError on token limit message', () => {
    const response = buildResponse('Error: token limit exceeded');
    expect(() => parseGeminiResponse(response)).toThrow(GeminiTokenLimitError);
  });
});
