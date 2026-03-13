import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oqbzewinweelfztewvvb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xYnpld2lud2VlbGZ6dGV3dnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNTMzMzYsImV4cCI6MjA4ODkyOTMzNn0.OSZ4wW_SWqxLJeFHFHSFQL1xael5_NehIoVs3VW84C4';

// Improved validation
const isConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  supabaseUrl !== 'your_supabase_url';

if (!isConfigured) {
  console.warn('Supabase Configuration Status:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    validUrl: supabaseUrl.startsWith('https://'),
    isPlaceholder: supabaseUrl === 'your_supabase_url'
  });
} else {
  console.log('Supabase successfully configured.');
}

// Only create client if configured, otherwise create a dummy or handle null
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

export const supabaseConfigured = isConfigured;
