import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

// Use Supabase JS client for all database operations instead of Drizzle ORM
// to solve connection pooling issues with "Tenant or user not found" (XX000).
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

// We keep the drizzle export for now if needed by other services not yet migrated,
// but the recommendation is to use the 'supabase' client above.
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false },
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client);

export type Database = typeof db;
