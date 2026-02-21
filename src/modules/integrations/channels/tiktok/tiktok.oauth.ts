import { env } from "../../../../config/env.js";

const TIKTOK_AUTH_URL = "https://auth.tiktok-shop.com/oauth/authorize";
const TIKTOK_TOKEN_URL = "https://auth.tiktok-shop.com/api/v2/token/get";

export function getTikTokAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    app_key: env.TIKTOK_APP_KEY ?? "",
    state,
    response_type: "code",
    redirect_uri: env.TIKTOK_REDIRECT_URI ?? "",
    scope: "shop_analytics,order_read,product_read",
  });
  return `${TIKTOK_AUTH_URL}?${params.toString()}`;
}

export async function exchangeTikTokCode(
  code: string,
  appKey: string,
  appSecret: string,
  redirectUri: string
): Promise<{ access_token: string; refresh_token?: string; expires_in: number }> {
  const body = new URLSearchParams({
    app_key: appKey,
    app_secret: appSecret,
    auth_code: code,
    grant_type: "authorized_code",
    redirect_uri: redirectUri,
  });

  const res = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`TikTok token exchange failed: ${res.status} ${err}`);
  }

  const data = (await res.json()) as {
    data?: { access_token?: string; refresh_token?: string; expires_in?: number };
    message?: string;
  };

  const d = data.data;
  if (!d?.access_token) {
    throw new Error(data.message ?? "Invalid TikTok token response");
  }

  return {
    access_token: d.access_token,
    refresh_token: d.refresh_token,
    expires_in: d.expires_in ?? 86400,
  };
}
