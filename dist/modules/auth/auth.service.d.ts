export interface RegisterInput {
    email: string;
    password: string;
    name?: string;
    workspaceName: string;
}
export interface LoginInput {
    email: string;
    password: string;
}
export declare const register: (input: RegisterInput) => Promise<{
    user: {
        id: string;
        email: string;
    };
    session: import("@supabase/supabase-js").AuthSession;
}>;
export declare const login: (input: LoginInput) => Promise<{
    user: {
        id: string;
        email: string | undefined;
    };
    session: import("@supabase/supabase-js").AuthSession;
    workspace: {
        workspace_id: any;
        workspaces: {
            name: any;
        }[];
    } | null;
}>;
//# sourceMappingURL=auth.service.d.ts.map