import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ComparisonForm from '../src/components/ComparisonForm';

const deferred = () => {
  let resolveFn: (v: any) => void = () => {};
  const promise = new Promise<any>((r) => {
    resolveFn = r;
  });
  return { promise, resolve: resolveFn };
};

const analysis = deferred();

vi.mock('../src/hooks/useMockData', () => ({
  useMockData: () => ({
    isLoading: false,
    simulateAnalysis: vi.fn(() => analysis.promise)
  })
}));

vi.mock('../src/services/geminiService', () => ({
  geminiService: {
    isQuotaExceeded: vi.fn(() => false),
    checkComparability: vi.fn(() =>
      Promise.resolve({ comparable: true, category1: 'computer', category2: 'computer' })
    ),
    checkDetailCompleteness: vi.fn(() =>
      Promise.resolve({
        current: { complete: true, missing: [] },
        new: { complete: true, missing: [] }
      })
    )
  }
}));

describe('ComparisonForm', () => {
  it('shows loading state immediately after submission', async () => {
    render(<ComparisonForm />);

    await userEvent.type(screen.getByLabelText(/current device/i), 'a');
    await userEvent.type(screen.getByLabelText(/Device you're considering/i), 'b');

    await userEvent.click(screen.getByRole('button', { name: /compare now/i }));

    expect(await screen.findByText(/Analyzing/i)).toBeInTheDocument();

    analysis.resolve({
      isIncompatible: true,
      currentDevice: 'a',
      newDevice: 'b',
      explanation: 'x'
    });
  });
});

