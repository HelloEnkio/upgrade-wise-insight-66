import { describe, it, expect } from 'vitest';
import { sanitizeInput } from '../src/utils/purify';

describe('sanitizeInput', () => {
  it('strips HTML tags', () => {
    expect(sanitizeInput('<b>hello</b>')).toBe('hello');
  });

  it('removes script content', () => {
    expect(sanitizeInput('<script>alert(1)</script>test')).toBe('test');
  });

  it('leaves normal text intact', () => {
    const input = 'He said "hi" and it\'s ok';
    expect(sanitizeInput(input)).toBe('He said "hi" and it\'s ok');
  });

  it('handles injection attempts', () => {
    const input = "name'; DROP TABLE users; --";
    expect(sanitizeInput(input)).toBe("name'; DROP TABLE users; --");
  });
});
