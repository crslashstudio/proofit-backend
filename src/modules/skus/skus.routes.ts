import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { AuthEnv } from "../../middlewares/auth.middleware.js";
import * as skusService from "./skus.service.js";
import { channelEnum } from "../../db/schema/integrations.js";
import { classificationEnum } from "../../db/schema/skus.js";

const app = new Hono<AuthEnv>();

const querySchema = z.object({
  channel: z.enum(channelEnum).optional(),
  classification: z.enum(classificationEnum).optional(),
});

/**
 * GET /skus?channel=&classification=
 * List SKUs for the current workspace (tenant isolation). Optional filters.
 */
app.get("/", zValidator("query", querySchema), async (c) => {
  const workspaceId = c.get("workspaceId");
  const query = c.req.valid("query");
  const list = await skusService.listSkus({
    workspaceId,
    channel: query.channel,
    classification: query.classification,
  });
  return c.json({ success: true, data: list });
});

export default app;
