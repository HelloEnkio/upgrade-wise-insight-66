import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComparisonDialogs from '../src/components/ComparisonDialogs';

describe('ComparisonDialogs', () => {
  it('renders PreciseSpecsDialog fields when showPreciseSpecs is true', () => {
    render(
      <ComparisonDialogs
        showProductNotFound={false}
        setShowProductNotFound={() => {}}
        notFoundProduct=""
        showQueue={false}
        setShowQueue={() => {}}
        showPreciseSpecs={true}
        setShowPreciseSpecs={() => {}}
        onPreciseSpecsSubmit={() => {}}
        onSkipPreciseSpecs={() => {}}
        preciseDevice="Device A"
        category="computer"
      />
    );

    expect(screen.getByLabelText(/Processor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/RAM/i)).toBeInTheDocument();
  });
});
