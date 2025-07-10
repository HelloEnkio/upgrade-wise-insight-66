import { describe, it, expect } from 'vitest';
import { extractReasonCategory } from '../src/utils/reasons';

describe('extractReasonCategory', () => {
  it('splits reason with markdown title', () => {
    const result = extractReasonCategory('**Performance:** Much faster.');
    expect(result).toEqual({ title: 'Performance', description: 'Much faster.' });
  });

  it('returns original string when pattern missing', () => {
    const result = extractReasonCategory('No special format');
    expect(result).toEqual({ title: null, description: 'No special format' });
  });
});
