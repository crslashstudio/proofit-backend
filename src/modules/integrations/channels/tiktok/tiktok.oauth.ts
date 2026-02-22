import { env } from "../../../../config/env.js";
import { supabase } from "../../../../db/client.js";

const TIKTOK_AUTH_URL = "https://auth.tiktok-shops.com/oauth/authorize";

export function generateAuthUrl(workspaceId: string): string {
  const params = new URLSearchParams({
    app_key: env.TIKTOK_APP_KEY ?? "",
    redirect_uri: env.TIKTOK_REDIRECT_URI ?? "",
    state: workspaceId,
    scope: "shop.read,order.read,product.read,finance.read",
  });
  return `${TIKTOK_AUTH_URL}?${params.toString()}`;
}

export const handleCallback = async (code: string, state: string) => {
  try {
    // state contains workspaceId
    const workspaceId = state;

    // Exchange code for token using TikTok API
    const tokenResponse = await fetch("https://auth.tiktok-shops.com/api/v2/token/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-tts-access-token": "",
      },
      body: JSON.stringify({
        app_key: env.TIKTOK_APP_KEY,
        app_secret: env.TIKTOK_APP_SECRET,
        auth_code: code,
        grant_type: "authorized_code",
      }),
    });

    // Get raw text first for debugging
    const rawText = await tokenResponse.text();
    console.log("[tiktok] Raw response:", rawText);
    console.log("[tiktok] Status:", tokenResponse.status);

    // Then parse
    let tokenData: any;
    try {
      tokenData = JSON.parse(rawText);
    } catch (e) {
      throw new Error(`Invalid JSON from TikTok: ${rawText.substring(0, 200)}`);
    }

    console.log("[tiktok] Parsed token data:", JSON.stringify(tokenData));

    if (tokenData.code !== 0) {
      throw new Error(`TikTok token error: ${tokenData.message}`);
    }

    const { access_token, refresh_token, expire_in, open_id, seller_name } = tokenData.data;

    // Save to integrations table
    const { error } = await supabase
      .from("integrations")
      .upsert(
        {
          workspace_id: workspaceId,
          channel: "tiktok",
          access_token,
          refresh_token,
          token_expires_at: new Date(Date.now() + expire_in * 1000).toISOString(),
          shop_id: open_id,
          shop_name: seller_name || "TikTok Shop",
          is_active: true,
        },
        { onConflict: "workspace_id,channel" }
      );

    if (error) throw new Error(error.message);

    return { success: true, shopName: seller_name };
  } catch (error: any) {
    console.error("[tiktok] Callback error:", error.message);
    throw error;
  }
};


