import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import * as ordersService from "./orders.service.js";
import { channelEnum } from "../../db/schema/integrations.js";
const app = new Hono();
const querySchema = z.object({
    channel: z.enum(channelEnum).optional(),
    date_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    date_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
/**
 * GET /orders?channel=&date_from=&date_to=
 * List orders for the current workspace (tenant isolation). Optional filters.
 */
app.get("/", zValidator("query", querySchema), async (c) => {
    const workspaceId = c.get("workspaceId");
    const query = c.req.valid("query");
    const list = await ordersService.listOrders({
        workspaceId,
        channel: query.channel,
        dateFrom: query.date_from,
        dateTo: query.date_to,
    });
    return c.json({ success: true, data: list });
});
export default app;
//# sourceMappingURL=orders.routes.js.map