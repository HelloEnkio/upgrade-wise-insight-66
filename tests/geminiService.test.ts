import { describe, it, expect, vi, afterEach } from 'vitest';
import { geminiService } from '../src/services/geminiService';

const wrap = (obj: any) => ({
  candidates: [
    {
      content: {
        parts: [{ text: JSON.stringify(obj) }]
      }
    }
  ]
});

describe('geminiService.checkComparability', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns comparable=true after retrying once', async () => {
    const first = { comparable: false, category1: 'smartphone', category2: 'smartphone' };
    const second = { comparable: true, category1: 'smartphone', category2: 'smartphone' };

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => wrap(first) })
      .mockResolvedValueOnce({ ok: true, json: async () => wrap(second) });

    vi.stubGlobal('fetch', fetchMock);

    // Bypass API key check
    (geminiService as any).apiKey = 'test-key';

    const result = await geminiService.checkComparability('iPhone', 'Samsung');
    expect(result).toEqual(second);
  });
});
