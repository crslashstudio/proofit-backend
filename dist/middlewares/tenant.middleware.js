import { createMiddleware } from "hono/factory";
import { supabase } from "../db/client.js";
/**
 * Resolves workspace_id for the current user (multi-tenant isolation).
 * Must run after authMiddleware so supabaseUserId is set.
 */
export const tenantMiddleware = createMiddleware(async (c, next) => {
    const supabaseUserId = c.get("supabaseUserId");
    if (!supabaseUserId) {
        return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    const { data: userRecord, error } = await supabase
        .from("users")
        .select("workspace_id")
        .eq("supabase_user_id", supabaseUserId)
        .single();
    if (error || !userRecord) {
        console.error("[tenant] No user row for supabase_user_id:", supabaseUserId, error?.message);
        return c.json({ success: false, error: "Tenant or user not found" }, 403);
    }
    c.set("workspaceId", userRecord.workspace_id);
    return next();
});
//# sourceMappingURL=tenant.middleware.js.map