export class GeminiParseError extends Error {
  constructor(message = 'Invalid response format from Gemini') {
    super(message);
    this.name = 'GeminiParseError';
  }
}

export class GeminiTokenLimitError extends Error {
  constructor(message = 'Gemini token limit reached') {
    super(message);
    this.name = 'GeminiTokenLimitError';
  }
}
