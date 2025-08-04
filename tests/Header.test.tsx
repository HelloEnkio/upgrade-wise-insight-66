import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import Header from '../src/components/Header';
import {
  ComparisonResultProvider,
  useComparisonResult,
} from '../src/contexts/ComparisonResultContext';
import '@testing-library/jest-dom';

const LocationAndResult = () => {
  const location = useLocation();
  const { hasResult } = useComparisonResult();
  return (
    <>
      <span data-testid="location">{location.pathname}</span>
      <span data-testid="has-result">{String(hasResult)}</span>
    </>
  );
};

describe('Header navigation', () => {
  it('opens dialog on logo click and navigates home on confirm', async () => {
    render(
      <ComparisonResultProvider initialHasResult={true}>
        <MemoryRouter initialEntries={['/result']}>
          <Header />
          <LocationAndResult />
        </MemoryRouter>
      </ComparisonResultProvider>
    );

    await userEvent.click(screen.getByRole('link', { name: /is it better/i }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /ok/i }));

    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('/');
      expect(screen.getByTestId('has-result')).toHaveTextContent('false');
    });
  });
});
