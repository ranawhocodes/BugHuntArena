import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { PlayerSaveData } from './schema';

/**
 * Loads player save data from Supabase for the given user ID.
 * Returns null if no saved data exists yet.
 */
export async function loadCloudSave(userId: string): Promise<PlayerSaveData | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('player_saves')
      .select('save_data')
      .eq('user_id', userId)
      .single();

    if (error) {
      // PGRST116 = "no rows returned" — not an error, just means first login
      if (error.code === 'PGRST116') return null;
      console.error('[CloudSync] Failed to load:', error.message);
      return null;
    }

    return data?.save_data as PlayerSaveData ?? null;
  } catch (err) {
    console.error('[CloudSync] Unexpected error loading save:', err);
    return null;
  }
}

/**
 * Saves player data to Supabase (upsert).
 * Uses user_id as the conflict key.
 */
export async function saveCloudData(userId: string, saveData: PlayerSaveData): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('player_saves')
      .upsert(
        {
          user_id: userId,
          save_data: saveData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      );

    if (error) {
      console.error('[CloudSync] Failed to save:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[CloudSync] Unexpected error saving:', err);
    return false;
  }
}

/**
 * Deletes player save data from Supabase.
 */
export async function clearCloudSave(userId: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await supabase
      .from('player_saves')
      .delete()
      .eq('user_id', userId);
  } catch (err) {
    console.error('[CloudSync] Failed to clear cloud save:', err);
  }
}
