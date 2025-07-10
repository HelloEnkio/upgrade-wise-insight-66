import { describe, it, expect } from 'vitest';
import { needsPreciseSpecs } from '../src/utils/specCheck';

describe('needsPreciseSpecs', () => {
  it('returns true when arrays are empty', () => {
    expect(needsPreciseSpecs({ specs: [], technicalSpecs: [] })).toBe(true);
  });

  it('returns true when below threshold', () => {
    expect(needsPreciseSpecs({ specs: ['a'], technicalSpecs: ['b'] })).toBe(true);
  });

  it('returns false when enough data', () => {
    expect(
      needsPreciseSpecs({ specs: [1, 2, 3], technicalSpecs: [1, 2, 3] })
    ).toBe(false);
  });
});
