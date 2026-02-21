export interface RegisterInput {
    email: string;
    password: string;
    workspaceName: string;
}
export interface LoginInput {
    email: string;
    password: string;
}
/**
 * Register: create Supabase Auth user, then create workspace and link user in our DB.
 * Multi-tenant: one workspace per signup; owner_id and users row establish isolation.
 */
export declare function register(input: RegisterInput): Promise<{
    user: {
        id: string;
        email: string | undefined;
    };
    workspace: {
        id: string;
        name: string;
        slug: string;
    };
    session: import("@supabase/supabase-js").AuthSession | null;
}>;
/**
 * Login: authenticate via Supabase Auth and return session (JWT).
 */
export declare function login(input: LoginInput): Promise<{
    user: {
        id: string;
        email: string | undefined;
    };
    session: import("@supabase/supabase-js").AuthSession;
}>;
//# sourceMappingURL=auth.service.d.ts.map