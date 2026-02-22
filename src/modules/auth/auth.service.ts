import { supabase } from "../../db/client.js";

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
  console.log("[auth/register] Step 1: Creating auth user via admin API", { email: input.email });

  // Use admin API to create user directly without email confirmation for now
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
  });

  if (authError) {
    console.error("[auth/register] Step 1 failed:", authError.message);
    if (authError.message.includes("already registered")) {
      throw new Error("Email already registered. Please log in.");
    }
    throw new Error(authError.message);
  }

  const user = authData.user;
  if (!user) {
    throw new Error("Failed to create user");
  }

  console.log("[auth/register] Step 1 OK: Auth user created", { userId: user.id });

  const slug = slugFromName(input.workspaceName);

  // Step 2: Create workspace
  console.log("[auth/register] Step 2: Inserting workspace", { slug, ownerId: user.id });
  const { data: workspaceData, error: workspaceError } = await supabase
    .from("workspaces")
    .insert({
      name: input.workspaceName,
      slug: slug,
      owner_id: user.id, // Ensure naming matches schema (Drizzle mapped ownerId to owner_id)
    })
    .select()
    .single();

  if (workspaceError) {
    console.error("[auth/register] Step 2 failed:", workspaceError);
    // Cleanup auth user if possible or just log it
    throw new Error(`Failed to create workspace: ${workspaceError.message}`);
  }

  console.log("[auth/register] Step 2 OK: Workspace created", { workspaceId: workspaceData.id });

  // Step 3: Create user record in our users table
  console.log("[auth/register] Step 3: Inserting user row", { workspaceId: workspaceData.id, supabaseUserId: user.id });
  const { error: userError } = await supabase
    .from("users")
    .insert({
      workspace_id: workspaceData.id,
      email: input.email,
      supabase_user_id: user.id,
      role: "owner",
    });

  if (userError) {
    console.error("[auth/register] Step 3 failed:", userError);
    throw new Error(`Failed to create user record: ${userError.message}`);
  }

  console.log("[auth/register] Step 3 OK: User row created");

  // For login after registration, we'll need a session. 
  // Since we used admin.createUser, we have to sign them in manually to get a session.
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (loginError) {
    console.error("[auth/register] Sign in failed after registration:", loginError.message);
  }

  return {
    user: { id: user.id, email: user.email },
    workspace: { id: workspaceData.id, name: workspaceData.name, slug: workspaceData.slug },
    session: loginData?.session || null,
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
