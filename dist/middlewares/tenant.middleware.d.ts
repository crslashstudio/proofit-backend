import type { AuthEnv } from "./auth.middleware.js";
/**
 * Resolves workspace_id for the current user (multi-tenant isolation).
 * Must run after authMiddleware so supabaseUserId is set.
 */
export declare const tenantMiddleware: import("hono").MiddlewareHandler<AuthEnv, string, {}, Response>;
//# sourceMappingURL=tenant.middleware.d.ts.map