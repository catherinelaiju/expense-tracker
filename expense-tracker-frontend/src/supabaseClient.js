// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// ⬇️ Replace these with your actual Supabase project values
const supabaseUrl = "https://ulfffbaaetrowenmkrph.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZmZmYmFhZXRyb3dlbm1rcnBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNzg5MDcsImV4cCI6MjA3MjY1NDkwN30.RJZJMeuUb6tH6QMqu8xoPSwjJpTkQvXfSb78qOzJg8s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
