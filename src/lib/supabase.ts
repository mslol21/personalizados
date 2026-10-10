import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://cjfbbqvutsarubftkdlo.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqZmJicXZ1dHNhcnViZnRrZGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2MDE1MjIsImV4cCI6MjEwNzE3NzUyMn0.mPLjR-EKdqtQNZdAr-nFRlHdmzsietJrjOxNwwtSohs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
