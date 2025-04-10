
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Using import.meta.env approach for Vite projects
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check for environment variables and provide fallbacks for development
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check that they are properly set in your Supabase project settings.');
}

// Create the Supabase client with explicit empty string fallbacks to prevent the "supabaseUrl is required" error
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
