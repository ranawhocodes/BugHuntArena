import { describe, it, expect } from 'vitest';
import {
  calculateXP,
  calculateBugBits,
  calculateLevel,
  updateStreak,
  getDailyPuzzles,
} from '../../src/engine/engine';
import { ALL_PUZZLES } from '../../src/content/puzzles';

describe('Game Engine — Pure Logic (Bricks 3 & 4)', () => {
  describe('calculateXP', () => {
    it('awards base XP for clean catch with no streak', () => {
      const res = calculateXP(1, 0, 0, true);
      expect(res.baseXp).toBe(20);
      expect(res.streakBonus).toBe(0);
      expect(res.hintPenalty).toBe(0);
      expect(res.totalXp).toBe(20);
    });

    it('adds streak bonus up to 25% cap', () => {
      // 3 days streak = 15% of 20 = 3 bonus
      const res1 = calculateXP(1, 3, 0, true);
      expect(res1.streakBonus).toBe(3);
      expect(res1.totalXp).toBe(23);

      // 10 days streak = 25% cap of 50 = 13 bonus
      const res2 = calculateXP(3, 10, 0, true);
      expect(res2.streakBonus).toBe(13);
      expect(res2.totalXp).toBe(63);
    });

    it('deducts penalties when hints are used', () => {
      // 1 hint used on difficulty 1 (20 XP) = 15% penalty = 3
      const res1 = calculateXP(1, 0, 1, false);
      expect(res1.hintPenalty).toBe(3);
      expect(res1.totalXp).toBe(17);

      // 3 hints used on difficulty 1 (20 XP) = 45% penalty = 9
      const res3 = calculateXP(1, 0, 3, false);
      expect(res3.hintPenalty).toBe(9);
      expect(res3.totalXp).toBe(11);
    });

    it('never drops below MIN_XP (5)', () => {
      const res = calculateXP(1, 0, 3, false);
      expect(res.totalXp).toBeGreaterThanOrEqual(5);
    });
  });

  describe('calculateBugBits', () => {
    it('converts XP to bits at 1:5 ratio with clean catch bonus', () => {
      // 25 XP without clean catch = 5 bits
      expect(calculateBugBits(25, false)).toBe(5);

      // 25 XP with clean catch = 5 + 3 = 8 bits
      expect(calculateBugBits(25, true)).toBe(8);

      // 0 XP with clean catch = 3 bits
      expect(calculateBugBits(0, true)).toBe(3);
    });
  });

  describe('calculateLevel', () => {
    it('calculates initial Level 1 at 0 XP', () => {
      const info = calculateLevel(0);
      expect(info.level).toBe(1);
      expect(info.title).toBe('Rookie Debugger');
      expect(info.currentLevelXp).toBe(0);
      expect(info.nextLevelXp).toBe(40);
      expect(info.progressPercent).toBe(0);
    });

    it('levels up to Level 2 at 40 XP', () => {
      const info = calculateLevel(40);
      expect(info.level).toBe(2);
      expect(info.title).toBe('Bug Spotter');
      expect(info.currentLevelXp).toBe(40);
      expect(info.nextLevelXp).toBe(160);
      expect(info.progressPercent).toBe(0);
    });

    it('calculates intermediate level progress percentage accurately', () => {
      // Level 1 span is 0..40. At 20 XP, progress should be 50%
      const info = calculateLevel(20);
      expect(info.level).toBe(1);
      expect(info.progressPercent).toBe(50);
    });

    it('handles high levels and titles', () => {
      // Level 4 (Code Detective) requires (4-1)^2 * 40 = 360 XP
      const info = calculateLevel(360);
      expect(info.level).toBe(4);
      expect(info.title).toBe('Code Detective');
    });
  });

  describe('updateStreak', () => {
    it('sets streak to 1 on initial active day', () => {
      const res = updateStreak(null, 0, 1, '2026-10-08');
      expect(res.newStreak).toBe(1);
      expect(res.freezesLeft).toBe(1);
      expect(res.streakSaved).toBe(false);
    });

    it('maintains streak on same day replay', () => {
      const res = updateStreak('2026-10-08', 5, 2, '2026-10-08');
      expect(res.newStreak).toBe(5);
      expect(res.freezesLeft).toBe(2);
      expect(res.streakSaved).toBe(false);
    });

    it('increments streak on consecutive day', () => {
      const res = updateStreak('2026-10-07', 4, 1, '2026-10-08');
      expect(res.newStreak).toBe(5);
      expect(res.freezesLeft).toBe(1);
      expect(res.streakSaved).toBe(false);
    });

    it('uses freeze to preserve streak if exactly 1 day is missed', () => {
      // Last active 2026-10-06, today is 2026-10-08 (missed 2026-10-07)
      const res = updateStreak('2026-10-06', 7, 2, '2026-10-08');
      expect(res.newStreak).toBe(8);
      expect(res.freezesLeft).toBe(1);
      expect(res.streakSaved).toBe(true);
    });

    it('breaks streak if missed day has no freeze available', () => {
      const res = updateStreak('2026-10-06', 7, 0, '2026-10-08');
      expect(res.newStreak).toBe(1);
      expect(res.freezesLeft).toBe(0);
      expect(res.streakSaved).toBe(false);
    });

    it('resets streak if missed more than 1 day even with freezes', () => {
      const res = updateStreak('2026-10-01', 10, 2, '2026-10-08');
      expect(res.newStreak).toBe(1);
      expect(res.freezesLeft).toBe(2);
    });
  });

  describe('getDailyPuzzles', () => {
    it('deterministically selects 3 distinct puzzles for a date', () => {
      const dailyA = getDailyPuzzles('2026-10-08', ALL_PUZZLES);
      const dailyB = getDailyPuzzles('2026-10-08', ALL_PUZZLES);

      expect(dailyA.length).toBe(3);
      expect(dailyA[0].id).toBe(dailyB[0].id);
      expect(dailyA[1].id).toBe(dailyB[1].id);
      expect(dailyA[2].id).toBe(dailyB[2].id);

      // Verify all 3 are distinct
      const ids = new Set(dailyA.map((p) => p.id));
      expect(ids.size).toBe(3);
    });

    it('selects different puzzles for different dates', () => {
      const daily1 = getDailyPuzzles('2026-10-08', ALL_PUZZLES);
      const daily2 = getDailyPuzzles('2026-10-09', ALL_PUZZLES);

      const keys1 = daily1.map((p) => p.id).join(',');
      const keys2 = daily2.map((p) => p.id).join(',');
      expect(keys1).not.toBe(keys2);
    });
  });
});
