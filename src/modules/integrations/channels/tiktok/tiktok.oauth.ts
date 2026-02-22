import { env } from "../../../../config/env.js";
import * as integrationsService from "../../integrations.service.js";

const TIKTOK_AUTH_URL = "https://auth.tiktok-shops.com/oauth/authorize";
const TIKTOK_TOKEN_URL = "https://auth.tiktok-shop.com/api/v2/token/get";

export function generateAuthUrl(workspaceId: string): string {
  const params = new URLSearchParams({
    app_key: env.TIKTOK_APP_KEY ?? "",
    redirect_uri: env.TIKTOK_REDIRECT_URI ?? "",
    state: workspaceId,
    scope: "shop.read,order.read,product.read,finance.read",
  });
  return `${TIKTOK_AUTH_URL}?${params.toString()}`;
}

export async function handleCallback(code: string, state: string): Promise<void> {
  if (!env.TIKTOK_APP_KEY || !env.TIKTOK_APP_SECRET || !env.TIKTOK_REDIRECT_URI) {
    throw new Error("TikTok integration is not configured");
  }

  const workspaceId = state;
  if (!workspaceId) {
    throw new Error("Invalid state: workspaceId missing");
  }

  const body = new URLSearchParams({
    app_key: env.TIKTOK_APP_KEY,
    app_secret: env.TIKTOK_APP_SECRET,
    auth_code: code,
    grant_type: "authorized_code",
    redirect_uri: env.TIKTOK_REDIRECT_URI,
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

  await integrationsService.upsertTikTokIntegration(workspaceId, {
    accessToken: d.access_token,
    refreshToken: d.refresh_token,
    expiresIn: d.expires_in ?? 86400,
  });
}


