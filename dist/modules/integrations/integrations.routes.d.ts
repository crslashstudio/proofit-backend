import { Hono } from "hono";
import type { AuthEnv } from "../../middlewares/auth.middleware.js";
declare const app: Hono<AuthEnv, import("hono/types").BlankSchema, "/">;
export default app;
/**
 * Public OAuth callback (no JWT). Mount at GET /integrations/tiktok/callback without auth middleware.
 * state = workspaceId:timestamp for multi-tenant token storage.
 */
export declare const tiktokCallbackApp: import("hono/hono-base").HonoBase<import("hono/types").BlankEnv, {
    "/": {
        $get: {
            input: {};
            output: {
                success: false;
                error: string;
            };
            outputFormat: "json";
            status: 400;
        } | {
            input: {};
            output: {
                success: false;
                error: string;
            };
            outputFormat: "json";
            status: 503;
        } | {
            input: {};
            output: undefined;
            outputFormat: "redirect";
            status: 302;
        };
    };
}, "/", "/">;
//# sourceMappingURL=integrations.routes.d.ts.map