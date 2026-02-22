import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import * as authService from "./auth.service.js";
const app = new Hono();
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1).max(255).optional(),
    workspaceName: z.string().min(1).max(255),
});
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});
/**
 * POST /auth/register
 * Creates Supabase user, workspace, and app user row for multi-tenant isolation.
 */
app.post("/register", zValidator("json", registerSchema), async (c) => {
    try {
        const body = c.req.valid("json");
        const result = await authService.register(body);
        return c.json({ success: true, data: result });
    }
    catch (e) {
        const message = e instanceof Error ? e.message : "Registration failed";
        console.error("[auth/register] Route error:", e);
        const isAlreadyRegistered = message.toLowerCase().includes("already registered") ||
            message.toLowerCase().includes("email already registered");
        return c.json({ success: false, error: message }, isAlreadyRegistered ? 409 : 400);
    }
});
/**
 * POST /auth/login
 * Returns Supabase session (access_token) for use in Authorization header.
 */
app.post("/login", zValidator("json", loginSchema), async (c) => {
    try {
        const body = c.req.valid("json");
        const result = await authService.login(body);
        return c.json({ success: true, data: result });
    }
    catch (e) {
        const message = e instanceof Error ? e.message : "Login failed";
        return c.json({ success: false, error: message }, 401);
    }
});
export default app;
//# sourceMappingURL=auth.routes.js.map