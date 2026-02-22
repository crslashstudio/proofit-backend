import { createClient } from "@supabase/supabase-js";
import { env } from "../../config/env.js";
import { db } from "../../db/client.js";
import { users } from "../../db/schema/users.js";
import { workspaces } from "../../db/schema/workspaces.js";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

export interface RegisterInput {
  email: string;
  password: string;
  workspaceName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

function slugFromName(name: string): string {
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
export async function register(input: RegisterInput) {
  console.log("[auth/register] Step 1: Supabase signUp", { email: input.email });
  const {
    data: { user, session: signUpSession },
    error: authError,
  } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: { emailRedirectTo: undefined },
  });

  if (authError) {
    console.error("[auth/register] Step 1 failed: Supabase auth error", authError.message);
    // Supabase returns "User already registered" (or similar) when email exists
    const msg = authError.message.toLowerCase();
    if (
      msg.includes("already registered") ||
      msg.includes("already been registered") ||
      authError.message === "User already registered"
    ) {
      throw new Error("Email already registered. Please log in.");
    }
    throw new Error(authError.message);
  }
  if (!user) {
    console.error("[auth/register] Step 1 failed: No user returned from Supabase");
    throw new Error("Failed to create user");
  }
  console.log("[auth/register] Step 1 OK: Supabase user created", { userId: user.id });

  const slug = slugFromName(input.workspaceName);
  console.log("[auth/register] Step 2: Starting DB transaction", { slug, ownerId: user.id });

  let workspace;
  try {
    workspace = await db.transaction(async (tx) => {
      console.log("[auth/register] Transaction: Inserting workspace...");
      const results = await tx
        .insert(workspaces)
        .values({
          name: input.workspaceName,
          slug: slug,
          ownerId: user.id,
        })
        .returning();

      const w = results[0];
      if (!w) {
        console.error("[auth/register] Transaction: Workspace insert returned no data");
        throw new Error("Failed to create workspace: No data returned");
      }
      console.log("[auth/register] Step 2 OK: Workspace created", { workspaceId: w.id });

      console.log("[auth/register] Step 3: Inserting user row", { workspaceId: w.id, supabaseUserId: user.id });
      await tx.insert(users).values({
        workspaceId: w.id,
        email: input.email,
        supabaseUserId: user.id,
        role: "owner",
      });
      console.log("[auth/register] Step 3 OK: User row created");
      return w;
    });
  } catch (txError: any) {
    console.error("[auth/register] Registration transaction failed:", {
      message: txError.message,
      code: txError.code,
      detail: txError.detail,
      stack: txError.stack
    });

    // Check for specific database errors
    if (txError.message?.includes("Tenant or user not found") || txError.code === "XX000") {
      throw new Error("Database error (Tenant or user not found). This usually indicates a configuration issue with the Supabase connection pooler.");
    }

    throw new Error(`Registration failed during database setup: ${txError.message || "Unknown error"}`);
  }

  // Prefer session from signUp response so the client gets the token for the user we just created.
  // getSession() can be null if email confirmation is required or storage hasn't updated yet.
  const session = signUpSession ?? (await supabase.auth.getSession()).data.session;
  console.log("[auth/register] Done: returning session", !!session, session ? "from signUp" : "fallback null");
  return {
    user: { id: user.id, email: user.email },
    workspace: { id: workspace.id, name: workspace.name, slug: workspace.slug },
    session,
  };
}

/**
 * Login: authenticate via Supabase Auth and return session (JWT).
 */
export async function login(input: LoginInput) {
  const {
    data: { user, session },
    error,
  } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) throw new Error(error.message);
  if (!user || !session) throw new Error("Login failed");

  return { user: { id: user.id, email: user.email }, session };
}
