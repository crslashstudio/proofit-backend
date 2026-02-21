import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { AuthEnv } from "../../middlewares/auth.middleware.js";
import * as campaignsService from "./campaigns.service.js";
import { channelEnum } from "../../db/schema/integrations.js";

const app = new Hono<AuthEnv>();

const querySchema = z.object({
  channel: z.enum(channelEnum).optional(),
});

/**
 * GET /campaigns?channel=
 * List campaigns for the current workspace (tenant isolation). Optional channel filter.
 */
app.get("/", zValidator("query", querySchema), async (c) => {
  const workspaceId = c.get("workspaceId");
  const query = c.req.valid("query");
  const list = await campaignsService.listCampaigns({
    workspaceId,
    channel: query.channel,
  });
  return c.json({ success: true, data: list });
});

export default app;
