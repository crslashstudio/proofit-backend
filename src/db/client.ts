import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as workspaces from "./schema/workspaces.js";
import * as users from "./schema/users.js";
import * as integrations from "./schema/integrations.js";
import * as orders from "./schema/orders.js";
import * as skus from "./schema/skus.js";
import * as campaigns from "./schema/campaigns.js";
import { env } from "../config/env.js";

// Log connection shape (password redacted) so you can confirm direct vs pooler
try {
  const u = new URL(env.DATABASE_URL);
  console.log(
    "[db] Connecting:",
    u.hostname,
    "port",
    u.port || "5432",
    "user",
    u.username
  );
} catch {
  /* ignore */
}

const client = postgres(env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false },
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

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
