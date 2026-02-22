import { supabase } from "../../db/client.js";
import type { Channel } from "../../db/schema/integrations.js";

export interface ListCampaignsQuery {
  workspaceId: string;
  channel?: Channel;
}

export async function listCampaigns(query: ListCampaignsQuery) {
  let queryBuilder = supabase
    .from("campaigns")
    .select("*")
    .eq("workspace_id", query.workspaceId);

  if (query.channel) {
    queryBuilder = queryBuilder.eq("channel", query.channel);
  }

  const { data, error } = await queryBuilder;

  if (error) {
    console.error("[campaigns.service] listCampaigns failed:", error.message);
    throw new Error(error.message);
  }

  return data;
}
