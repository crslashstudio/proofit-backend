import { Hono } from "hono";
import * as integrationsService from "./integrations.service.js";
import { getTikTokAuthorizeUrl, exchangeTikTokCode } from "./channels/tiktok/tiktok.oauth.js";
import { env } from "../../config/env.js";
const app = new Hono();
/**
 * GET /integrations
 * List connected channels for the current workspace (tenant isolation).
 */
app.get("/", async (c) => {
    const workspaceId = c.get("workspaceId");
    const list = await integrationsService.listByWorkspace(workspaceId);
    return c.json({ success: true, data: list });
});
/**
 * POST /integrations/tiktok/connect
 * Initiates TikTok OAuth: returns redirect URL. Frontend redirects user there.
 */
app.post("/tiktok/connect", async (c) => {
    if (!env.TIKTOK_APP_KEY || !env.TIKTOK_APP_SECRET || !env.TIKTOK_REDIRECT_URI) {
        return c.json({ success: false, error: "TikTok integration is not configured" }, 503);
    }
    const workspaceId = c.get("workspaceId");
    const state = `${workspaceId}:${Date.now()}`;
    const url = getTikTokAuthorizeUrl(state);
    return c.json({ success: true, data: { redirectUrl: url, state } });
});
export default app;
/**
 * Public OAuth callback (no JWT). Mount at GET /integrations/tiktok/callback without auth middleware.
 * state = workspaceId:timestamp for multi-tenant token storage.
 */
export const tiktokCallbackApp = new Hono().get("/", async (c) => {
    const code = c.req.query("code");
    const state = c.req.query("state");
    if (!code || !state) {
        return c.json({ success: false, error: "Missing code or state" }, 400);
    }
    const [workspaceId] = state.split(":");
    if (!workspaceId) {
        return c.json({ success: false, error: "Invalid state" }, 400);
    }
    if (!env.TIKTOK_APP_KEY || !env.TIKTOK_APP_SECRET || !env.TIKTOK_REDIRECT_URI) {
        return c.json({ success: false, error: "TikTok integration is not configured" }, 503);
    }
    try {
        const tokens = await exchangeTikTokCode(code, env.TIKTOK_APP_KEY, env.TIKTOK_APP_SECRET, env.TIKTOK_REDIRECT_URI);
        await integrationsService.upsertTikTokIntegration(workspaceId, {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expiresIn: tokens.expires_in,
        });
    }
    catch (e) {
        const message = e instanceof Error ? e.message : "OAuth failed";
        return c.json({ success: false, error: message }, 400);
    }
    return c.redirect("/integrations?connected=tiktok");
});
//# sourceMappingURL=integrations.routes.js.map