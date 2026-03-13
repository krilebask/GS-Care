import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_url';

if (!isConfigured) {
  console.warn('Supabase credentials missing or invalid. Real-time features will be disabled.');
}

// Only create client if configured, otherwise create a dummy or handle null
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

export const supabaseConfigured = isConfigured;
