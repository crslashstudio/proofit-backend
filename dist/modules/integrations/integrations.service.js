import { supabase } from "../../db/client.js";
export async function listByWorkspace(workspaceId) {
    const { data, error } = await supabase
        .from("integrations")
        .select("id, channel, shop_id, shop_name, is_active, created_at")
        .eq("workspace_id", workspaceId);
    if (error) {
        console.error("[integrations.service] listByWorkspace failed:", error.message);
        throw new Error(error.message);
    }
    // Map snake_case to camelCase for the frontend if needed, 
    // though Supabase return might be used directly.
    return data.map(item => ({
        id: item.id,
        channel: item.channel,
        shopId: item.shop_id,
        shopName: item.shop_name,
        isActive: item.is_active,
        createdAt: item.created_at
    }));
}
export async function upsertTikTokIntegration(workspaceId, data) {
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
        if (updateError)
            throw new Error(updateError.message);
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
    if (insertError)
        throw new Error(insertError.message);
    return inserted;
}
export async function getIntegrationById(id, workspaceId) {
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
//# sourceMappingURL=integrations.service.js.map