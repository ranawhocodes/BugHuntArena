import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DailyScreen } from '../../src/screens/Daily/DailyScreen';
import { ProfileScreen } from '../../src/screens/Profile/ProfileScreen';
import { AppStateProvider } from '../../src/app/AppState';

describe('Daily Hunt & Profile (Bricks 9 & 10)', () => {
  describe('DailyScreen', () => {
    it('renders daily hunt title with today date and 3 challenge steps', () => {
      render(
        <AppStateProvider>
          <DailyScreen />
        </AppStateProvider>,
      );

      expect(screen.getByText(/Daily Hunt:/i)).toBeInTheDocument();
      expect(screen.getByText('01')).toBeInTheDocument();
      expect(screen.getByText('02')).toBeInTheDocument();
      expect(screen.getByText('03')).toBeInTheDocument();
    });
  });

  describe('ProfileScreen', () => {
    it('renders hunter card with level stats', () => {
      render(
        <AppStateProvider>
          <ProfileScreen />
        </AppStateProvider>,
      );

      expect(screen.getByText(/Rookie Debugger/i)).toBeInTheDocument();
      expect(screen.getByText(/Level 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Total XP/i)).toBeInTheDocument();
      expect(screen.getByText(/Hunter Badges/i)).toBeInTheDocument();
      expect(screen.getByText(/The Bug Dex/i)).toBeInTheDocument();
    });

    it('renders all 10 achievement badges', () => {
      render(
        <AppStateProvider>
          <ProfileScreen />
        </AppStateProvider>,
      );

      expect(screen.getByText(/First Step/i)).toBeInTheDocument();
      expect(screen.getByText(/First Blood/i)).toBeInTheDocument();
      expect(screen.getByText(/Sniper/i)).toBeInTheDocument();
      expect(screen.getByText(/Spark/i)).toBeInTheDocument();
      expect(screen.getByText(/Inferno/i)).toBeInTheDocument();
      expect(screen.getByText(/Polyglot/i)).toBeInTheDocument();
      expect(screen.getByText(/Best Friend/i)).toBeInTheDocument();
      expect(screen.getByText(/Collector/i)).toBeInTheDocument();
      expect(screen.getByText(/Master Hunter/i)).toBeInTheDocument();
      expect(screen.getByText(/Arena Legend/i)).toBeInTheDocument();
    });
  });
});
