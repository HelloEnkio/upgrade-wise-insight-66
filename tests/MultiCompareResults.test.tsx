import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MultiCompareResults from '../src/components/MultiCompareResults';

const sampleData = {
  categories: ['Performance', 'Display'],
  products: [
    {
      name: 'Phone A',
      scores: { Performance: 90, Display: 95 },
      overallScore: 92,
      recommendation: 'Best Choice',
      affiliateLink: 'https://a.com'
    },
    {
      name: 'Phone B',
      scores: { Performance: 85, Display: 90 },
      overallScore: 88,
      recommendation: 'Good Value',
      affiliateLink: 'https://b.com'
    }
  ]
};

describe('MultiCompareResults', () => {
  const renderComponent = () =>
    render(
      <MultiCompareResults
        data={sampleData}
        plan="basic"
        onClose={() => {}}
        onBackToForm={() => {}}
      />
    );

  it('renders product names in table headers', () => {
    renderComponent();
    expect(screen.getByText('Phone A')).toBeInTheDocument();
    expect(screen.getByText('Phone B')).toBeInTheDocument();
  });

  it('renders overall scores row', () => {
    renderComponent();
    expect(screen.getByText(/Overall Score/i)).toBeInTheDocument();
    expect(screen.getByText('92')).toBeInTheDocument();
    expect(screen.getByText('88')).toBeInTheDocument();
  });
});
