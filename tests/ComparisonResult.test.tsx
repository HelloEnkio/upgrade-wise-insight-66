import React from 'react';
import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ComparisonResult from '../src/components/ComparisonResult';

const mockData = {
  currentDevice: 'Device A',
  newDevice: 'Device B',
  recommendation: 'upgrade' as const,
  score: 90,
  takeHome: 'Better performance overall',
  connoisseurSpecs: [
    {
      category: 'CPU',
      current: { value: 'A1', technical: 'specA' },
      new: { value: 'B1', technical: 'specB' },
      improvement: 'better' as const,
      score: 95,
      details: 'Faster'
    }
  ]
};

describe('ComparisonResult', () => {
  it('shows TechnicalView when switch is toggled', async () => {
    render(<ComparisonResult data={mockData} onReset={() => {}} />);
    expect(screen.queryByText('Detailed Technical Analysis')).toBeNull();
    await userEvent.click(screen.getByRole('switch'));
    expect(screen.getByText('Detailed Technical Analysis')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('switch'));
    expect(screen.queryByText('Detailed Technical Analysis')).toBeNull();
  });

  it('renders summary in default view', () => {
    render(<ComparisonResult data={mockData} onReset={() => {}} />);
    expect(screen.getByText(/Better performance overall/i)).toBeInTheDocument();
  });
});
