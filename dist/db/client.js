import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as workspaces from "./schema/workspaces.js";
import * as users from "./schema/users.js";
import * as integrations from "./schema/integrations.js";
import * as orders from "./schema/orders.js";
import * as skus from "./schema/skus.js";
import * as campaigns from "./schema/campaigns.js";
import { env } from "../config/env.js";
// Use Supabase connection pooling URL for serverless/Railway:
// Session mode:  port 5432 (direct) or 6543 with ?pgbouncer=true
// Transaction mode (recommended for serverless): port 6543, pooler.supabase.com
// DATABASE_URL format: postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
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
//# sourceMappingURL=client.js.map