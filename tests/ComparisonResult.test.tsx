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
  reasons: ['Better performance'],
  specs: [
    { category: 'processor', current: 'A1', new: 'B1', improvement: 'better' as const }
  ],
  technicalSpecs: [
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

  it('renders comparison table headers with device names', () => {
    render(<ComparisonResult data={mockData} onReset={() => {}} />);
    expect(screen.getByRole('columnheader', { name: /component/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /device a/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /impact/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /device b/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /why better/i })).toBeInTheDocument();
  });
});
