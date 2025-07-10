import { describe, it, expect } from 'vitest';
import { needsPreciseSpecs } from '../src/utils/specCheck';

describe('needsPreciseSpecs', () => {
  it('returns true when arrays are empty', () => {
    expect(needsPreciseSpecs({ connoisseurSpecs: [] })).toBe(true);
  });

  it('returns true when below threshold', () => {
    expect(needsPreciseSpecs({ connoisseurSpecs: ['a'] })).toBe(true);
  });

  it('returns false when enough data', () => {
    expect(
      needsPreciseSpecs({ connoisseurSpecs: [1, 2, 3] })
    ).toBe(false);
  });
});
