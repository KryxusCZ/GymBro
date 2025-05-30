
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://punfykrxefikiynvxmuq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1bmZ5a3J4ZWZpa2l5bnZ4bXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MzE5NDAsImV4cCI6MjA2MjAwNzk0MH0.OvB34TVbfmGcgVKgxdiieAIR6_aTyo41Xucb99v7JCE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);