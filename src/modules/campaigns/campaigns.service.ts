import { db } from "../../db/client.js";
import { campaigns } from "../../db/schema/campaigns.js";
import { eq, and } from "drizzle-orm";
import type { Channel } from "../../db/schema/integrations.js";

export interface ListCampaignsQuery {
  workspaceId: string;
  channel?: Channel;
}

export async function listCampaigns(query: ListCampaignsQuery) {
  const conditions = [eq(campaigns.workspaceId, query.workspaceId)];
  if (query.channel) conditions.push(eq(campaigns.channel, query.channel));
  return db
    .select()
    .from(campaigns)
    .where(and(...conditions));
}
