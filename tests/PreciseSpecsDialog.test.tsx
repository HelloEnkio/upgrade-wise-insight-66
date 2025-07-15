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

  it('renders computer spec fields by default', () => {
    render(
      <PreciseSpecsDialog
        isOpen={true}
        onClose={() => {}}
        onSubmit={() => {}}
        onSkip={() => {}}
      />
    );

    expect(screen.getByLabelText(/Processor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/RAM/i)).toBeInTheDocument();
  });

  it('renders vehicle spec fields when category is vehicle', () => {
    render(
      <PreciseSpecsDialog
        isOpen={true}
        onClose={() => {}}
        onSubmit={() => {}}
        onSkip={() => {}}
        category="vehicle"
      />
    );

    expect(screen.getByLabelText(/Fuel Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Model Year/i)).toBeInTheDocument();
  });

  it('places the skip button before other actions', () => {
    render(
      <PreciseSpecsDialog
        isOpen={true}
        onClose={() => {}}
        onSubmit={() => {}}
        onSkip={() => {}}
      />
    );

    const skipButton = screen.getByText(/Whatever, just compare/i);
    const cancelButton = screen.getByText('Cancel');

    // Ensure the skip button appears before the cancel button in the DOM
    const position = skipButton.compareDocumentPosition(cancelButton);
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });
});
