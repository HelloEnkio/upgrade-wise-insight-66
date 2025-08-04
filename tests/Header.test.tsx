import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from '../src/components/Header';
import { ComparisonResultProvider } from '../src/contexts/ComparisonResultContext';
import '@testing-library/jest-dom';

describe('Header navigation', () => {
  it('shows a dialog before navigating when a result exists', async () => {
    render(
      <ComparisonResultProvider initialHasResult={true}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ComparisonResultProvider>
    );

    await userEvent.click(screen.getByRole('link', { name: /is it better/i }));
    expect(
      screen.getByText(/navigating away will lose it/i)
    ).toBeInTheDocument();
  });

  it('closes the dialog when cancel is clicked', async () => {
    render(
      <ComparisonResultProvider initialHasResult={true}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ComparisonResultProvider>
    );

    await userEvent.click(screen.getByRole('link', { name: /is it better/i }));
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(
      screen.queryByText(/navigating away will lose it/i)
    ).not.toBeInTheDocument();
  });
});
