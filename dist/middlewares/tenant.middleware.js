import { createMiddleware } from "hono/factory";
import { db } from "../db/client.js";
import { users } from "../db/schema/users.js";
import { eq } from "drizzle-orm";
/**
 * Resolves workspace_id for the current user (multi-tenant isolation).
 * Must run after authMiddleware so supabaseUserId is set.
 * Looks up our users table by supabase_user_id and attaches workspaceId to context.
 * All data access must filter by this workspaceId so users only see their own workspace data.
 */
export const tenantMiddleware = createMiddleware(async (c, next) => {
    const supabaseUserId = c.get("supabaseUserId");
    if (!supabaseUserId) {
        return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    const [workspaceUser] = await db
        .select({ workspaceId: users.workspaceId })
        .from(users)
        .where(eq(users.supabaseUserId, supabaseUserId))
        .limit(1);
    if (!workspaceUser) {
        return c.json({ success: false, error: "User not associated with a workspace" }, 403);
    }
    c.set("workspaceId", workspaceUser.workspaceId);
    return next();
});
//# sourceMappingURL=tenant.middleware.js.map