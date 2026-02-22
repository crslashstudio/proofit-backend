import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./config/env.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import { tenantMiddleware } from "./middlewares/tenant.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import workspaceRoutes from "./modules/workspace/workspace.routes.js";
import integrationsRoutes, {
  tiktokCallbackApp,
} from "./modules/integrations/integrations.routes.js";
import ordersRoutes from "./modules/orders/orders.routes.js";
import skusRoutes from "./modules/skus/skus.routes.js";
import campaignsRoutes from "./modules/campaigns/campaigns.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";
import { showRoutes } from "hono/dev";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.onError((err, c) => {
  console.error(err);
  return c.json(
    { success: false, error: err.message ?? "Internal server error" },
    500
  );
});

app.notFound((c) => {
  return c.json({ success: false, error: "Not found" }, 404);
});

// Public auth routes (no JWT)
app.route("/auth", authRoutes);

// Public OAuth callback (no JWT; state carries workspaceId for multi-tenant storage)
app.route("/integrations/tiktok/callback", tiktokCallbackApp);

// Protected API: validate JWT then resolve workspace for tenant isolation
const protectedApp = new Hono()
  .use("*", authMiddleware)
  .use("*", tenantMiddleware);

protectedApp.route("/workspace", workspaceRoutes);
protectedApp.route("/integrations", integrationsRoutes);
protectedApp.route("/orders", ordersRoutes);
protectedApp.route("/skus", skusRoutes);
protectedApp.route("/campaigns", campaignsRoutes);
protectedApp.route("/ai", aiRoutes);

app.route("/", protectedApp);

app.get("/health", (c) => c.json({ success: true, data: { status: "ok" } }));

export default app;

serve({ fetch: app.fetch, port: env.PORT });
console.log(`PROOFIT backend running at http://localhost:${env.PORT}`);

// Show all registered routes on startup
console.log("\nRegistered Routes:");
showRoutes(app);
