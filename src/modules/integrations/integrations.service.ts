import { supabase } from "../../db/client.js";


export async function listByWorkspace(workspaceId: string) {
  const { data, error } = await supabase
    .from("integrations")
    .select("*")
    .eq("workspace_id", workspaceId);

  if (error) {
    console.error("[integrations.service] listByWorkspace failed:", error.message);
    throw new Error(error.message);
  }

  return data;
}

export async function upsertTikTokIntegration(
  workspaceId: string,
  data: {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
    shopId?: string;
    shopName?: string;
  }
) {
  const tokenExpiresAt = new Date(Date.now() + data.expiresIn * 1000).toISOString();

  // Find existing integration
  const { data: existing, error: findError } = await supabase
    .from("integrations")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("channel", "tiktok")
    .limit(1)
    .maybeSingle();

  if (findError) {
    console.error("[integrations.service] find existing failed:", findError.message);
    throw new Error(findError.message);
  }

  if (existing) {
    const { data: updated, error: updateError } = await supabase
      .from("integrations")
      .update({
        access_token: data.accessToken,
        refresh_token: data.refreshToken ?? null,
        token_expires_at: tokenExpiresAt,
        shop_id: data.shopId ?? existing.shop_id,
        shop_name: data.shopName ?? existing.shop_name,
        is_active: true,
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (updateError) throw new Error(updateError.message);
    return updated;
  }

  const { data: inserted, error: insertError } = await supabase
    .from("integrations")
    .insert({
      workspace_id: workspaceId,
      channel: "tiktok",
      access_token: data.accessToken,
      refresh_token: data.refreshToken ?? null,
      token_expires_at: tokenExpiresAt,
      shop_id: data.shopId ?? null,
      shop_name: data.shopName ?? null,
      is_active: true,
    })
    .select()
    .single();

  if (insertError) throw new Error(insertError.message);
  return inserted;
}

export async function getIntegrationById(
  id: string,
  workspaceId: string
) {
  const { data, error } = await supabase
    .from("integrations")
    .select("*")
    .eq("id", id)
    .eq("workspace_id", workspaceId)
    .maybeSingle();

  if (error) {
    console.error("[integrations.service] getIntegrationById failed:", error.message);
    return null;
  }

  return data;
}

export async function deactivateTikTokIntegration(workspaceId: string) {
  const { data, error } = await supabase
    .from("integrations")
    .update({ is_active: false })
    .eq("workspace_id", workspaceId)
    .eq("channel", "tiktok")
    .select()
    .maybeSingle();

  if (error) {
    console.error("[integrations.service] deactivateTikTokIntegration failed:", error.message);
    throw new Error(error.message);
  }

  return data;
}
