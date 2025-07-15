import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PreciseSpecsDialog from '../src/components/PreciseSpecsDialog';


describe('PreciseSpecsDialog', () => {
  it('shows device information when provided', () => {
    render(
      <PreciseSpecsDialog
        isOpen={true}
        onClose={() => {}}
        onSubmit={() => {}}
        onSkip={() => {}}
        device="MacBook Pro"
      />
    );
    expect(screen.getByText(/More details are needed for/i)).toHaveTextContent('MacBook Pro');
  });
});
