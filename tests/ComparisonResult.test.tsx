import React from 'react';
import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ComparisonResult from '../src/components/ComparisonResult';
import { normalizeConnoisseurSpecs } from '../src/services/specNormalizer';

const mockData = {
  currentDevice: 'Device A',
  newDevice: 'Device B',
  recommendation: 'upgrade' as const,
  score: 90,
  reasons: ['**Performance:** Faster', '**Battery:** Lasts longer'],
  takeHome: 'Better performance overall',
  connoisseurSpecs: [
    {
      category: 'CPU',
      currentValue: 'A1',
      currentTechnical: 'specA',
      newValue: 'B1',
      newTechnical: 'specB',
      improvement: 'better' as const,
      score: 95,
      details: 'Faster'
    }
  ]
};

const normalizedData = {
  ...mockData,
  connoisseurSpecs: normalizeConnoisseurSpecs(mockData.connoisseurSpecs)
};

describe('ComparisonResult', () => {
  it('shows TechnicalView when switch is toggled', async () => {
    render(<ComparisonResult data={normalizedData} onReset={() => {}} />);
    expect(screen.queryByText('Detailed Technical Analysis')).toBeNull();
    await userEvent.click(screen.getByRole('switch'));
    expect(screen.getByText('Detailed Technical Analysis')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('switch'));
    expect(screen.queryByText('Detailed Technical Analysis')).toBeNull();
  });

  it('renders summary in default view', () => {
    render(<ComparisonResult data={normalizedData} onReset={() => {}} />);
    expect(screen.getByText(/Better performance overall/i)).toBeInTheDocument();
  });

  it('renders spec table by default and hides it when toggled', async () => {
    render(<ComparisonResult data={normalizedData} onReset={() => {}} />);
    expect(screen.getByRole('rowheader', { name: /CPU/i })).toBeInTheDocument();
    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText('B1')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('switch'));
    expect(
      screen.queryByRole('heading', { name: /Quick Spec Comparison/i })
    ).toBeNull();
    await userEvent.click(screen.getByRole('switch'));
    expect(
      screen.getByRole('heading', { name: /Quick Spec Comparison/i })
    ).toBeInTheDocument();
  });

  it('parses reason titles and descriptions', () => {
    render(<ComparisonResult data={normalizedData} onReset={() => {}} />);
    expect(screen.getByRole('rowheader', { name: /Performance/i })).toBeInTheDocument();
    expect(screen.getByText('Faster')).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: /Battery/i })).toBeInTheDocument();
    expect(screen.getByText('Lasts longer')).toBeInTheDocument();
  });

  it('does not show Current/New sublabels in headers', () => {
    render(<ComparisonResult data={normalizedData} onReset={() => {}} />);
    expect(screen.queryByText('Current')).toBeNull();
    expect(screen.queryByText(/^New$/)).toBeNull();
  });
});
