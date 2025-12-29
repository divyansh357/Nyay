import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Expo surfaces env vars that start with EXPO_PUBLIC_. Fallback to unprefixed
// names so local .env files still work, but prefer prefixed for production.
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

let supabaseClient: SupabaseClient | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables are missing. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY (or legacy SUPABASE_URL/SUPABASE_KEY) to enable backend integration.'
  );
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: 'nyayasetu-auth',
    },
  });
}

export const supabase = supabaseClient;
export const isSupabaseConfigured = supabaseClient !== null;
