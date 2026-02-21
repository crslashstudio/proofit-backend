import { createClient } from "@supabase/supabase-js";
import { env } from "../../config/env.js";
import { db } from "../../db/client.js";
import { users } from "../../db/schema/users.js";
import { workspaces } from "../../db/schema/workspaces.js";
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
function slugFromName(name) {
    return name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "workspace";
}
/**
 * Register: create Supabase Auth user, then create workspace and link user in our DB.
 * Multi-tenant: one workspace per signup; owner_id and users row establish isolation.
 */
export async function register(input) {
    console.log("[auth/register] Step 1: Supabase signUp", { email: input.email });
    const { data: { user }, error: authError, } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: { emailRedirectTo: undefined },
    });
    if (authError) {
        console.error("[auth/register] Step 1 failed: Supabase auth error", authError.message);
        throw new Error(authError.message);
    }
    if (!user) {
        console.error("[auth/register] Step 1 failed: No user returned from Supabase");
        throw new Error("Failed to create user");
    }
    console.log("[auth/register] Step 1 OK: Supabase user created", { userId: user.id });
    const slug = slugFromName(input.workspaceName);
    console.log("[auth/register] Step 2: Insert workspace", { slug, ownerId: user.id });
    let workspace;
    try {
        workspace = await db.transaction(async (tx) => {
            const [w] = await tx
                .insert(workspaces)
                .values({
                name: input.workspaceName,
                slug: slug,
                ownerId: user.id,
            })
                .returning();
            if (!w)
                throw new Error("Failed to create workspace");
            console.log("[auth/register] Step 2 OK: Workspace created", { workspaceId: w.id });
            console.log("[auth/register] Step 3: Insert user row", { workspaceId: w.id, supabaseUserId: user.id });
            await tx.insert(users).values({
                workspaceId: w.id,
                email: input.email,
                supabaseUserId: user.id,
                role: "owner",
            });
            console.log("[auth/register] Step 3 OK: User row created");
            return w;
        });
    }
    catch (txError) {
        console.error("[auth/register] Step 2/3 failed (workspace or user insert):", txError);
        throw txError;
    }
    const session = await supabase.auth.getSession();
    console.log("[auth/register] Done: returning session", !!session.data.session);
    return {
        user: { id: user.id, email: user.email },
        workspace: { id: workspace.id, name: workspace.name, slug: workspace.slug },
        session: session.data.session,
    };
}
/**
 * Login: authenticate via Supabase Auth and return session (JWT).
 */
export async function login(input) {
    const { data: { user, session }, error, } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
    });
    if (error)
        throw new Error(error.message);
    if (!user || !session)
        throw new Error("Login failed");
    return { user: { id: user.id, email: user.email }, session };
}
//# sourceMappingURL=auth.service.js.map