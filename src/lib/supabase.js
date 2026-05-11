import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use a try/catch so that a bad/missing credential never throws at the module
// level — a module-level throw kills the React tree before any error boundary
// can catch it, leaving the page permanently blank.
// Both the legacy "eyJ..." JWT format and the newer "sb_publishable_..." format
// are valid for @supabase/supabase-js v2.
let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('[Supabase] createClient failed — auth disabled:', err.message);
  }
} else {
  console.warn('[Supabase] Missing env vars — auth disabled. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export { supabase };
