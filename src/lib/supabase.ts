import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client singleton.
 *
 * Both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are public/safe —
 * Row Level Security (RLS) on the database is what protects data.
 *
 * Set these in:
 *   - Local: .env file (git-ignored)
 *   - Vercel: Settings → Environment Variables
 */
export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const supabaseUrl =
  (import.meta.env.VITE_SUPABASE_URL as string) || 'https://placeholder-project.supabase.co';
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'placeholder-anon-key';

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Auth and cloud sync will use local mode.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

