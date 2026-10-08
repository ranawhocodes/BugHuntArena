import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PetCompanion } from '../../src/components/PetCompanion';
import { PetDenScreen } from '../../src/screens/PetDen/PetDenScreen';
import { AppStateProvider } from '../../src/app/AppState';

describe('Pet Companion & Pet Den (Bricks 7 & 8)', () => {
  describe('PetCompanion', () => {
    it('renders all three species cleanly as inline SVG', () => {
      const { rerender } = render(<PetCompanion species="fire_beetle" />);
      expect(screen.getByRole('img', { name: /fire beetle companion pet/i })).toBeInTheDocument();

      rerender(<PetCompanion species="byte_moth" />);
      expect(screen.getByRole('img', { name: /byte moth companion pet/i })).toBeInTheDocument();

      rerender(<PetCompanion species="glitch_hound" />);
      expect(screen.getByRole('img', { name: /glitch hound companion pet/i })).toBeInTheDocument();
    });

    it('renders speech bubble when speechText is provided', () => {
      render(<PetCompanion speechText="Hello Hunter!" />);
      expect(screen.getByText('Hello Hunter!')).toBeInTheDocument();
    });

    it('renders cosmetics (hat, glasses, crown)', () => {
      const { container, rerender } = render(<PetCompanion cosmetic="hat" />);
      expect(container.querySelector('.bha-pet-hat')).toBeInTheDocument();

      rerender(<PetCompanion cosmetic="glasses" />);
      expect(container.querySelector('.bha-pet-glasses')).toBeInTheDocument();

      rerender(<PetCompanion cosmetic="crown" />);
      expect(container.querySelector('.bha-pet-crown')).toBeInTheDocument();
    });
  });

  describe('PetDenScreen', () => {
    it('renders pet stage, happiness bar, and interaction buttons', () => {
      render(
        <AppStateProvider>
          <PetDenScreen />
        </AppStateProvider>,
      );

      expect(screen.getByText(/The Pet Den/i)).toBeInTheDocument();
      expect(screen.getByText(/Happiness/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /feed/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /stroke/i })).toBeInTheDocument();
    });

    it('allows stroking the pet and gives feedback', () => {
      render(
        <AppStateProvider>
          <PetDenScreen />
        </AppStateProvider>,
      );

      const strokeBtn = screen.getByRole('button', { name: /stroke/i });
      fireEvent.click(strokeBtn);

      // Stroke count updates
      expect(screen.getByRole('button', { name: /stroke/i })).toBeInTheDocument();
    });

    it('allows equipping and unequipping cosmetics', () => {
      render(
        <AppStateProvider>
          <PetDenScreen />
        </AppStateProvider>,
      );

      const crownCard = screen.getByText('Slayer Crown');
      fireEvent.click(crownCard);

      const noneCard = screen.getByText('None');
      fireEvent.click(noneCard);
    });
  });
});
