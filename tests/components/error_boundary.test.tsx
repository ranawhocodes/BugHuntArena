import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';

function ProblemChild(): never {
  throw new Error('Simulation crash');
}

describe('ErrorBoundary (Brick 12)', () => {
  it('renders fallback UI when child component throws', () => {
    // Suppress console.error in test output for simulated crash
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/An unexpected glitch occurred/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload Arena/i })).toBeInTheDocument();

    spy.mockRestore();
  });
});
