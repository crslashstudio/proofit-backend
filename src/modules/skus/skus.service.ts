import { supabase } from "../../db/client.js";
import type { Channel } from "../../db/schema/integrations.js";
import type { SkuClassification } from "../../db/schema/skus.js";

export interface ListSkusQuery {
  workspaceId: string;
  channel?: Channel;
  classification?: SkuClassification;
}

export async function listSkus(query: ListSkusQuery) {
  let queryBuilder = supabase
    .from("skus")
    .select("*")
    .eq("workspace_id", query.workspaceId);

  if (query.channel) {
    queryBuilder = queryBuilder.eq("channel", query.channel);
  }
  if (query.classification) {
    queryBuilder = queryBuilder.eq("classification", query.classification);
  }

  const { data, error } = await queryBuilder;

  if (error) {
    console.error("[skus.service] listSkus failed:", error.message);
    throw new Error(error.message);
  }

  return data;
}
