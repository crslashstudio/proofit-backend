import { Hono } from "hono";
import * as workspaceService from "./workspace.service.js";
const app = new Hono();
/**
 * GET /workspace/me
 * Returns the current user's workspace (tenant isolation: workspaceId from tenant middleware).
 */
app.get("/me", async (c) => {
    const workspaceId = c.get("workspaceId");
    const workspace = await workspaceService.getWorkspaceById(workspaceId);
    if (!workspace) {
        return c.json({ success: false, error: "Workspace not found" }, 404);
    }
    return c.json({
        success: true,
        data: {
            id: workspace.id,
            name: workspace.name,
            slug: workspace.slug,
            ownerId: workspace.ownerId,
            createdAt: workspace.createdAt,
        },
    });
});
export default app;
//# sourceMappingURL=workspace.routes.js.map