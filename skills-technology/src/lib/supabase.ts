import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// These are injected by Lovable Cloud once enabled. If you're wiring this
// up outside Lovable, set VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in
// your .env file — the anon key is safe to expose client-side, all real
// access control lives in the RLS policies (see supabase/migrations).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
