import { describe, it, expect } from 'vitest';
import { parseGeminiResponse } from '../src/utils/parseGeminiResponse';

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
});
