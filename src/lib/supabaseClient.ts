
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Using import.meta.env approach for Vite projects
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check for environment variables and provide fallbacks for development
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check that they are properly set in your Supabase project settings.');
}

// Create a dummy client if environment variables are missing
// This allows the app to at least load in development without crashing
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyLXByb2plY3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjQyMjY0MCwiZXhwIjoxOTMyMDg1ODQwfQ.placeholder'
);
