import { createMiddleware } from "hono/factory";
import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
/**
 * Validates JWT from Authorization: Bearer <token> using Supabase Auth.
 * On success, sets authPayload (sub, email) and supabaseUserId on context.
 * Does NOT set workspaceId; tenant.middleware resolves that from our users table.
 */
export const authMiddleware = createMiddleware(async (c, next) => {
    const authHeader = c.req.header("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
        return c.json({ success: false, error: "Missing or invalid Authorization header" }, 401);
    }
    const { data: { user }, error, } = await supabase.auth.getUser(token);
    if (error || !user) {
        return c.json({ success: false, error: error?.message ?? "Invalid or expired token" }, 401);
    }
    c.set("authPayload", {
        sub: user.id,
        email: user.email ?? undefined,
        role: user.role,
    });
    c.set("supabaseUserId", user.id);
    return next();
});
//# sourceMappingURL=auth.middleware.js.map