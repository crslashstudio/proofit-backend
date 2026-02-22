import { Hono } from "hono";
import * as integrationsService from "./integrations.service.js";
import { generateAuthUrl, handleCallback } from "./channels/tiktok/tiktok.oauth.js";
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
 * GET /integrations/tiktok/connect
 * Initiates TikTok OAuth: returns redirect URL. Frontend redirects user there.
 */
app.get("/tiktok/connect", async (c) => {
    if (!env.TIKTOK_APP_KEY || !env.TIKTOK_APP_SECRET || !env.TIKTOK_REDIRECT_URI) {
        return c.json({ success: false, error: "TikTok integration is not configured" }, 503);
    }
    const workspaceId = c.get("workspaceId");
    const url = generateAuthUrl(workspaceId);
    return c.json({ success: true, data: { authUrl: url } });
});
export default app;
/**
 * Public OAuth callback (no JWT). Mount at GET /integrations/tiktok/callback without auth middleware.
 */
export const tiktokCallbackApp = new Hono().get("/", async (c) => {
    const code = c.req.query("code");
    const state = c.req.query("state");
    if (!code || !state) {
        console.error("[tiktok/callback] Missing code or state", { code, state });
        return c.redirect(`${env.FRONTEND_URL}/settings?tiktok=error&message=${encodeURIComponent("Missing code or state")}`);
    }
    try {
        const result = await handleCallback(code, state);
        console.log("[tiktok/callback] Success:", result);
        return c.redirect(`${env.FRONTEND_URL}/settings?tiktok=connected`);
    }
    catch (e) {
        console.error("[tiktok/callback] Full Error:", e);
        const message = e instanceof Error ? e.message : "OAuth failed";
        return c.redirect(`${env.FRONTEND_URL}/settings?tiktok=error&message=${encodeURIComponent(message)}`);
    }
});
//# sourceMappingURL=integrations.routes.js.map