import type { AuthEnv } from "./auth.middleware.js";
/**
 * Resolves workspace_id for the current user (multi-tenant isolation).
 * Must run after authMiddleware so supabaseUserId is set.
 * Looks up our users table by supabase_user_id and attaches workspaceId to context.
 * All data access must filter by this workspaceId so users only see their own workspace data.
 */
export declare const tenantMiddleware: import("hono").MiddlewareHandler<AuthEnv, string, {}, Response>;
//# sourceMappingURL=tenant.middleware.d.ts.map