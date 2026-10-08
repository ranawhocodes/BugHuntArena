import type { BugCategory } from '../content/types';

export interface PetState {
  species: 'fire_beetle' | 'byte_moth' | 'glitch_hound';
  name: string;
  stage: 1 | 2 | 3 | 4; // Evolution stages
  happiness: number; // 0..100
  lastFedTimestamp: number;
  strokesToday: number;
  lastStrokeDate: string; // 'YYYY-MM-DD'
  cosmetic?: 'hat' | 'glasses' | 'crown' | null;
}

export interface PlayerStats {
  attempts: number;
  mistakes: number;
  cleanCatches: number;
}

export interface PlayerSaveData {
  version: 1;
  xp: number;
  bugBits: number;
  streakDays: number;
  streakFreezes: number;
  lastActiveDate: string | null; // 'YYYY-MM-DD'
  completedPuzzleIds: string[];
  capturedCreatureIds: string[];
  unlockedBadgeIds: string[];
  categoryStats: Partial<Record<BugCategory, PlayerStats>>;
  pet: PetState;
  dailyCompletedDates: string[]; // List of 'YYYY-MM-DD'
}

/**
 * Creates clean initial player state.
 */
export function createInitialPlayerState(): PlayerSaveData {
  const today = new Date().toISOString().split('T')[0];

  return {
    version: 1,
    xp: 0,
    bugBits: 50, // Starting gift of 50 Bits
    streakDays: 0,
    streakFreezes: 1, // 1 starting freeze shield
    lastActiveDate: null,
    completedPuzzleIds: [],
    capturedCreatureIds: [],
    unlockedBadgeIds: ['badge-welcome'],
    categoryStats: {},
    pet: {
      species: 'fire_beetle',
      name: 'Sparky',
      stage: 1,
      happiness: 80,
      lastFedTimestamp: Date.now(),
      strokesToday: 0,
      lastStrokeDate: today,
      cosmetic: null,
    },
    dailyCompletedDates: [],
  };
}
