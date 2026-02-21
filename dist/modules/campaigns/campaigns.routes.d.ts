import { Hono } from "hono";
import type { AuthEnv } from "../../middlewares/auth.middleware.js";
declare const app: Hono<AuthEnv, import("hono/types").BlankSchema, "/">;
export default app;
//# sourceMappingURL=campaigns.routes.d.ts.map