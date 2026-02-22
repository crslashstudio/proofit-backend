import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

// Official Supabase client for all database operations.
// This replaces Drizzle ORM to resolve connection pooling issues.
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
