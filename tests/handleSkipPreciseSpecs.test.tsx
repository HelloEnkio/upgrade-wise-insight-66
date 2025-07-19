import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useComparisonForm } from '../src/hooks/useComparisonForm';
import { ComparisonResultProvider } from '../src/contexts/ComparisonResultContext';
import { GeminiTokenLimitError } from '../src/utils/geminiErrors';

vi.mock('../src/hooks/useMockData', () => ({
  useMockData: () => ({
    isLoading: false,
    simulateAnalysis: vi.fn(() => Promise.reject(new GeminiTokenLimitError()))
  })
}));

const toastMock = vi.fn();
vi.mock('../src/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock })
}));

vi.mock('../src/services/geminiService', () => ({
  geminiService: {
    getProductSpecs: vi.fn(() => Promise.resolve({}))
  }
}));

describe('handleSkipPreciseSpecs', () => {
  it('closes dialog and shows toast on token limit error', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ComparisonResultProvider>{children}</ComparisonResultProvider>
    );
    const { result } = renderHook(() => useComparisonForm(), { wrapper });

    act(() => {
      result.current.setCurrentProduct('a');
      result.current.setNewProduct('b');
      result.current.setShowPreciseSpecs(true);
    });

    await act(async () => {
      await result.current.handleSkipPreciseSpecs();
    });

    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Response Too Long' })
    );
    expect(result.current.showPreciseSpecs).toBe(false);
  });
});
