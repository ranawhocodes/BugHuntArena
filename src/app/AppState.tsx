import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { loadSaveData, saveData, clearSaveData } from '../storage/storage';
import { loadCloudSave, saveCloudData, clearCloudSave } from '../storage/cloudSync';
import { createInitialPlayerState } from '../storage/schema';
import type { PlayerSaveData, PetState } from '../storage/schema';
import type { BugCategory } from '../content/types';
import { PET_FEED_COST, PET_FEED_COOLDOWN_MS, PET_MAX_STROKES_PER_DAY } from '../engine/constants';
import { updateStreak } from '../engine/engine';
import { useAuth } from '../auth/AuthContext';

interface AppStateContextValue {
  state: PlayerSaveData;
  syncing: boolean;
  recordPuzzleCompletion: (
    puzzleId: string,
    creatureId: string,
    category: BugCategory,
    xpEarned: number,
    bitsEarned: number,
    cleanCatch: boolean,
  ) => void;
  feedPet: () => { success: boolean; message: string };
  strokePet: () => { success: boolean; message: string };
  setPetCosmetic: (cosmetic: PetState['cosmetic']) => void;
  resetProgress: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

/** Debounce interval for cloud saves (ms) */
const CLOUD_SAVE_DEBOUNCE = 2000;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<PlayerSaveData>(() => loadSaveData());
  const [syncing, setSyncing] = useState(false);
  const cloudSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialLoadDone = useRef(false);

  // Load cloud save when user logs in
  useEffect(() => {
    if (!user) {
      initialLoadDone.current = false;
      return;
    }

    // Only load once per login
    if (initialLoadDone.current) return;

    let cancelled = false;
    setSyncing(true);

    loadCloudSave(user.id).then((cloudData) => {
      if (cancelled) return;

      if (cloudData) {
        // Cloud data exists — use it and update localStorage
        setState(cloudData);
        saveData(cloudData);
      } else {
        // No cloud data — push local state to cloud
        const local = loadSaveData();
        saveCloudData(user.id, local);
      }

      initialLoadDone.current = true;
      setSyncing(false);
    });

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Save state changes to both localStorage and cloud (debounced)
  useEffect(() => {
    // Always save to localStorage immediately
    saveData(state);

    // If user is logged in, also save to cloud (debounced)
    if (user && initialLoadDone.current) {
      if (cloudSaveTimer.current) {
        clearTimeout(cloudSaveTimer.current);
      }
      cloudSaveTimer.current = setTimeout(() => {
        saveCloudData(user.id, state);
      }, CLOUD_SAVE_DEBOUNCE);
    }

    return () => {
      if (cloudSaveTimer.current) {
        clearTimeout(cloudSaveTimer.current);
      }
    };
  }, [state, user]);

  const recordPuzzleCompletion = useCallback(
    (
      puzzleId: string,
      creatureId: string,
      category: BugCategory,
      xpEarned: number,
      bitsEarned: number,
      cleanCatch: boolean,
    ) => {
      setState((prev) => {
        const today = new Date().toISOString().split('T')[0];
        const streakResult = updateStreak(
          prev.lastActiveDate,
          prev.streakDays,
          prev.streakFreezes,
          today,
        );

        const newCompleted = prev.completedPuzzleIds.includes(puzzleId)
          ? prev.completedPuzzleIds
          : [...prev.completedPuzzleIds, puzzleId];

        const newCreatures = prev.capturedCreatureIds.includes(creatureId)
          ? prev.capturedCreatureIds
          : [...prev.capturedCreatureIds, creatureId];

        const prevCat = prev.categoryStats[category] || {
          attempts: 0,
          mistakes: 0,
          cleanCatches: 0,
        };

        const updatedCat = {
          attempts: prevCat.attempts + 1,
          mistakes: cleanCatch ? prevCat.mistakes : prevCat.mistakes + 1,
          cleanCatches: cleanCatch ? prevCat.cleanCatches + 1 : prevCat.cleanCatches,
        };

        return {
          ...prev,
          xp: prev.xp + xpEarned,
          bugBits: prev.bugBits + bitsEarned,
          streakDays: streakResult.newStreak,
          streakFreezes: streakResult.freezesLeft,
          lastActiveDate: today,
          completedPuzzleIds: newCompleted,
          capturedCreatureIds: newCreatures,
          categoryStats: {
            ...prev.categoryStats,
            [category]: updatedCat,
          },
        };
      });
    },
    [],
  );

  const feedPet = useCallback((): { success: boolean; message: string } => {
    let result = { success: false, message: '' };

    setState((prev) => {
      if (prev.bugBits < PET_FEED_COST) {
        result = { success: false, message: `Need ${PET_FEED_COST} Bug Bits to feed pet.` };
        return prev;
      }

      const now = Date.now();
      if (now - prev.pet.lastFedTimestamp < PET_FEED_COOLDOWN_MS) {
        result = { success: false, message: 'Your pet is still full! Try again later.' };
        return prev;
      }

      result = { success: true, message: 'Yum! Your pet is delighted (+20 Happiness).' };
      return {
        ...prev,
        bugBits: prev.bugBits - PET_FEED_COST,
        pet: {
          ...prev.pet,
          happiness: Math.min(100, prev.pet.happiness + 20),
          lastFedTimestamp: now,
        },
      };
    });

    return result;
  }, []);

  const strokePet = useCallback((): { success: boolean; message: string } => {
    let result = { success: false, message: '' };

    setState((prev) => {
      const today = new Date().toISOString().split('T')[0];
      const isNewDay = prev.pet.lastStrokeDate !== today;
      const currentStrokes = isNewDay ? 0 : prev.pet.strokesToday;

      if (currentStrokes >= PET_MAX_STROKES_PER_DAY) {
        result = { success: false, message: 'Pet is satisfied for today!' };
        return prev;
      }

      result = { success: true, message: '*Purr* Pet loved that! (+1 Bug Bit)' };
      return {
        ...prev,
        bugBits: prev.bugBits + 1,
        pet: {
          ...prev.pet,
          happiness: Math.min(100, prev.pet.happiness + 5),
          strokesToday: currentStrokes + 1,
          lastStrokeDate: today,
        },
      };
    });

    return result;
  }, []);

  const setPetCosmetic = useCallback((cosmetic: PetState['cosmetic']) => {
    setState((prev) => ({
      ...prev,
      pet: {
        ...prev.pet,
        cosmetic,
      },
    }));
  }, []);

  const resetProgress = useCallback(() => {
    clearSaveData();
    if (user) {
      clearCloudSave(user.id);
    }
    setState(createInitialPlayerState());
  }, [user]);

  return (
    <AppStateContext.Provider
      value={{
        state,
        syncing,
        recordPuzzleCompletion,
        feedPet,
        strokePet,
        setPetCosmetic,
        resetProgress,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppStateContextValue {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
