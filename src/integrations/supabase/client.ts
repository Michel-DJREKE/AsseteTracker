// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ydahgqbgoxpcqhguljca.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkYWhncWJnb3hwY3FoZ3VsamNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMzQ1MjksImV4cCI6MjA2NDcxMDUyOX0.lKURl3LrgX7JtX6hRWjEQ435xih54bE_4sNA_L2x_mc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);