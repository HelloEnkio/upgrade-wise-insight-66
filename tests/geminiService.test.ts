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
      .mockResolvedValueOnce({ ok: true, json: async () => ({ allowed: true, used: 1 }) })
      .mockResolvedValueOnce({ ok: true, json: async () => wrap(first) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ allowed: true, used: 2 }) })
      .mockResolvedValueOnce({ ok: true, json: async () => wrap(second) });

    vi.stubGlobal('fetch', fetchMock);

    const result = await geminiService.checkComparability('iPhone', 'Samsung');
    expect(result).toEqual(second);
  });

  it('normalizes multiword categories', async () => {
    const response = {
      comparable: true,
      category1: 'Flagship Smartphone',
      category2: 'Mid-range Smartphone'
    };

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ allowed: true, used: 1 }) })
      .mockResolvedValueOnce({ ok: true, json: async () => wrap(response) });

    vi.stubGlobal('fetch', fetchMock);

    const result = await geminiService.checkComparability('iPhone', 'Samsung');
    expect(result).toEqual({
      comparable: true,
      category1: 'flagship',
      category2: 'mid-range'
    });
  });
});

describe('geminiService.getProductComparison', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('retries with simplified prompt when token limit is reached', async () => {
    const first = {
      candidates: [
        {
          finishReason: 'MAX_TOKENS',
          content: { parts: [{ text: '{}' }] }
        }
      ]
    };
    const secondPayload = {
      recommendation: 'keep',
      score: 42,
      takeHome: 'ok'
    };
    const second = {
      candidates: [
        {
          content: { parts: [{ text: JSON.stringify(secondPayload) }] }
        }
      ]
    };

    const apiMock = vi
      .spyOn(geminiService as any, 'callGeminiAPI')
      .mockResolvedValueOnce(first)
      .mockResolvedValueOnce(second);

    const result = await geminiService.getProductComparison('old', 'new');

    expect(apiMock).toHaveBeenCalledTimes(2);
    expect(apiMock.mock.calls[0][0]).toMatch(/connoisseurSpecs/);
    expect(apiMock.mock.calls[1][0]).not.toMatch(/connoisseurSpecs/);
    expect(result).toEqual(secondPayload);
  });
});
