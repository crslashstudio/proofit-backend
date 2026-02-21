import { Hono } from "hono";
import * as aiService from "./ai.service.js";
const app = new Hono();
/**
 * GET /ai/insight
 * Placeholder for AI insight generation (Gemini API). Returns a static message until integrated.
 */
app.get("/insight", async (c) => {
    const workspaceId = c.get("workspaceId");
    const result = await aiService.generateInsight(workspaceId);
    return c.json({ success: true, data: result });
});
export default app;
//# sourceMappingURL=ai.routes.js.map