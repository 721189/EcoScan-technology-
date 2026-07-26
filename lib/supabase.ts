import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase configuration incomplete. Auth features will be disabled.\n' +
    'Add these to your .env file:\n' +
    '  VITE_SUPABASE_URL=your_supabase_project_url\n' +
    '  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key\n' +
    'Visit https://supabase.com to create a project.'
  );
}

export const supabase: SupabaseClient | null =
  typeof supabaseUrl === 'string' && supabaseUrl.length > 0 &&
  typeof supabaseAnonKey === 'string' && supabaseAnonKey.length > 0
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Export error for testing whether Supabase is configured
export const isSupabaseConfigured = (): boolean => supabase !== null;

export const getSupabaseError = (): string => {
  if (!supabaseUrl) {
    return 'Missing VITE_SUPABASE_URL environment variable';
  }
  if (!supabaseAnonKey) {
    return 'Missing VITE_SUPABASE_ANON_KEY environment variable';
  }
  return '';
};
