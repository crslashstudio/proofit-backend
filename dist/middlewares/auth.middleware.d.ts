export type AuthPayload = {
    sub: string;
    email?: string;
    role?: string;
};
export type AuthEnv = {
    Variables: {
        authPayload: AuthPayload;
        workspaceId: string;
        supabaseUserId: string;
    };
};
/**
 * Validates JWT from Authorization: Bearer <token> using Supabase Auth.
 * On success, sets authPayload (sub, email) and supabaseUserId on context.
 * Does NOT set workspaceId; tenant.middleware resolves that from our users table.
 */
export declare const authMiddleware: import("hono").MiddlewareHandler<AuthEnv, string, {}, Response>;
//# sourceMappingURL=auth.middleware.d.ts.map