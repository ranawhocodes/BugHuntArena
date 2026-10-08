import { STORAGE_KEY, MAX_STORAGE_BYTES } from '../engine/constants';
import { createInitialPlayerState } from './schema';
import type { PlayerSaveData } from './schema';

/**
 * Validates whether an object is a plausible PlayerSaveData.
 */
function isValidSaveData(obj: unknown): obj is PlayerSaveData {
  if (!obj || typeof obj !== 'object') return false;
  const data = obj as Record<string, unknown>;

  return (
    data.version === 1 &&
    typeof data.xp === 'number' &&
    typeof data.bugBits === 'number' &&
    typeof data.streakDays === 'number' &&
    Array.isArray(data.completedPuzzleIds) &&
    Array.isArray(data.capturedCreatureIds) &&
    typeof data.pet === 'object' &&
    data.pet !== null
  );
}

/**
 * Safely loads player save data from localStorage.
 * Guaranteed to never throw — returns initial state on any error.
 */
export function loadSaveData(): PlayerSaveData {
  if (typeof window === 'undefined' || !window.localStorage) {
    return createInitialPlayerState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createInitialPlayerState();
    }

    const parsed = JSON.parse(raw);
    if (isValidSaveData(parsed)) {
      return parsed;
    }

    console.warn('Storage data corrupted or incompatible version, resetting.');
    return createInitialPlayerState();
  } catch {
    return createInitialPlayerState();
  }
}

/**
 * Safely saves player state to localStorage.
 * Checks byte budget and catches QuotaExceeded errors.
 */
export function saveData(data: PlayerSaveData): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    const json = JSON.stringify(data);
    if (json.length > MAX_STORAGE_BYTES) {
      console.error(`Save state exceeds max storage limit (${json.length} bytes).`);
      return false;
    }

    window.localStorage.setItem(STORAGE_KEY, json);
    return true;
  } catch (err) {
    console.error('Failed to write to localStorage:', err);
    return false;
  }
}

/**
 * Clears player save data from localStorage.
 */
export function clearSaveData(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
}
