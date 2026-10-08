import { describe, it, expect, beforeEach } from 'vitest';
import { loadSaveData, saveData, clearSaveData } from '../../src/storage/storage';
import { createInitialPlayerState } from '../../src/storage/schema';
import { STORAGE_KEY } from '../../src/engine/constants';

describe('Storage Layer Resilience (Brick 4)', () => {
  beforeEach(() => {
    clearSaveData();
  });

  it('loads default initial player state when storage is empty', () => {
    const data = loadSaveData();
    expect(data.version).toBe(1);
    expect(data.xp).toBe(0);
    expect(data.bugBits).toBe(50);
    expect(data.streakDays).toBe(0);
    expect(data.pet.name).toBe('Sparky');
  });

  it('saves and reloads state accurately', () => {
    const state = createInitialPlayerState();
    state.xp = 120;
    state.bugBits = 85;
    state.streakDays = 4;
    state.completedPuzzleIds = ['py-01-off-by-one'];

    const saved = saveData(state);
    expect(saved).toBe(true);

    const reloaded = loadSaveData();
    expect(reloaded.xp).toBe(120);
    expect(reloaded.bugBits).toBe(85);
    expect(reloaded.streakDays).toBe(4);
    expect(reloaded.completedPuzzleIds).toContain('py-01-off-by-one');
  });

  it('gracefully recovers to initial state when storage is corrupted with invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{invalid-malformed-json:::');
    const data = loadSaveData();
    expect(data.version).toBe(1);
    expect(data.xp).toBe(0);
  });

  it('gracefully recovers when storage has incompatible version or missing required fields', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 99, unknownField: true }));
    const data = loadSaveData();
    expect(data.version).toBe(1);
    expect(data.xp).toBe(0);
  });
});
