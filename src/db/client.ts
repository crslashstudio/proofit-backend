import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as workspaces from "./schema/workspaces.js";
import * as users from "./schema/users.js";
import * as integrations from "./schema/integrations.js";
import * as orders from "./schema/orders.js";
import * as skus from "./schema/skus.js";
import * as campaigns from "./schema/campaigns.js";
import { env } from "../config/env.js";

// Supabase DATABASE_URL must match the connection type:
//
// DIRECT (port 5432) – recommended for local dev. No pooler, no tenant check:
//   postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
//
// POOLER (port 6543) – for serverless. Username MUST be postgres.[PROJECT_REF]:
//   postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
//
// "Tenant or user not found" (XX000) = often happens with pooler. For local dev, use DIRECT (port 5432).
function validateDatabaseUrl(url: string): void {
  try {
    const u = new URL(url);
    const port = u.port || (u.protocol === "postgresql:" ? "5432" : "");
    const isPooler = port === "6543" || u.hostname.includes("pooler");
    const username = u.username || "";
    if (isPooler && (username === "postgres" || !username.includes("."))) {
      throw new Error(
        "DATABASE_URL is using the pooler (port 6543) but username is '" +
          username +
          "'. For local dev use DIRECT: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
      );
    }
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("DATABASE_URL")) throw e;
  }
}
validateDatabaseUrl(env.DATABASE_URL);

// Log connection shape (password redacted) so you can confirm direct vs pooler
try {
  const u = new URL(env.DATABASE_URL);
  console.log(
    "[db] Connecting:",
    u.hostname,
    "port",
    u.port || "5432",
    "user",
    u.username,
    "(direct = port 5432, pooler = 6543; use direct for local dev)"
  );
} catch {
  /* ignore */
}

const client = postgres(env.DATABASE_URL, { max: 10 });

export const db = drizzle(client, {
  schema: {
    ...workspaces,
    ...users,
    ...integrations,
    ...orders,
    ...skus,
    ...campaigns,
  },
});

export type Database = typeof db;
