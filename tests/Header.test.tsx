import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from '../src/components/Header';
import { ComparisonResultProvider } from '../src/contexts/ComparisonResultContext';
import '@testing-library/jest-dom';

describe('Header navigation', () => {
  it('prompts before navigating when a result exists', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(
      <ComparisonResultProvider initialHasResult={true}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ComparisonResultProvider>
    );

    await userEvent.click(screen.getByRole('link', { name: /is it better/i }));
    expect(confirmSpy).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });
});
