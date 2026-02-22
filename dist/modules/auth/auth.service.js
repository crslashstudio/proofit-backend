import { createClient } from "@supabase/supabase-js";
import { env } from "../../config/env.js";
// Standalone Supabase client for Auth Service
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
export const register = async (input) => {
    const { email, password, workspaceName } = input;
    console.log("[auth/register] Step 1: Create auth user", { email });
    // Step 1: Create auth user via admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });
    if (authError) {
        console.error("[auth/register] Auth error:", authError.message);
        throw new Error(authError.message);
    }
    const userId = authData.user.id;
    console.log("[auth/register] Step 1 OK: Auth user created", { userId });
    // Step 2: Insert workspace
    const slug = workspaceName.toLowerCase().replace(/\s+/g, "-");
    console.log("[auth/register] Step 2: Insert workspace", { slug, userId });
    const { data: workspace, error: wsError } = await supabase
        .from("workspaces")
        .insert({ name: workspaceName, slug, owner_id: userId })
        .select()
        .single();
    if (wsError) {
        console.error("[auth/register] Workspace error:", wsError.message);
        throw new Error(wsError.message);
    }
    console.log("[auth/register] Step 2 OK: Workspace created", {
        workspaceId: workspace.id,
    });
    // Step 3: Insert user record
    console.log("[auth/register] Step 3: Insert user record", {
        workspaceId: workspace.id,
        userId,
    });
    const { error: userError } = await supabase.from("users").insert({
        workspace_id: workspace.id,
        supabase_user_id: userId,
        email,
        role: "owner",
    });
    if (userError) {
        console.error("[auth/register] User record error:", userError.message);
        throw new Error(userError.message);
    }
    console.log("[auth/register] Step 3 OK: User row created");
    // Step 4: Get session
    console.log("[auth/register] Step 4: Sign in to get session");
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({ email, password });
    if (sessionError) {
        console.error("[auth/register] Session error:", sessionError.message);
        throw new Error(sessionError.message);
    }
    return {
        user: { id: userId, email },
        session: sessionData.session,
    };
};
export const login = async (input) => {
    const { email, password } = input;
    console.log("[auth/login] Sign in");
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) {
        console.error("[auth/login] Sign in error:", error.message);
        throw new Error(error.message);
    }
    // Get workspace and user data
    console.log("[auth/login] Fetching workspace/user data", {
        userId: data.user.id,
    });
    const { data: userData, error: userError } = await supabase
        .from("users")
        .select("workspace_id, workspaces(name)")
        .eq("supabase_user_id", data.user.id)
        .single();
    if (userError) {
        console.warn("[auth/login] Failed to fetch workspace data:", userError.message);
    }
    return {
        user: { id: data.user.id, email: data.user.email },
        session: data.session,
        workspace: userData,
    };
};
//# sourceMappingURL=auth.service.js.map