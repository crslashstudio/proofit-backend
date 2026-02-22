import { supabase } from "../../db/client.js";

export async function getWorkspaceById(workspaceId: string) {
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", workspaceId)
    .single();

  if (error) {
    console.error(
      "[workspace.service] getWorkspaceById failed:",
      error.message
    );
    return null;
  }

  return data;
}
