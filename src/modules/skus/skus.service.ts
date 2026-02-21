import { db } from "../../db/client.js";
import { skus } from "../../db/schema/skus.js";
import { eq, and } from "drizzle-orm";
import type { Channel } from "../../db/schema/integrations.js";
import type { SkuClassification } from "../../db/schema/skus.js";

export interface ListSkusQuery {
  workspaceId: string;
  channel?: Channel;
  classification?: SkuClassification;
}

export async function listSkus(query: ListSkusQuery) {
  const conditions = [eq(skus.workspaceId, query.workspaceId)];
  if (query.channel) conditions.push(eq(skus.channel, query.channel));
  if (query.classification) conditions.push(eq(skus.classification, query.classification));
  return db
    .select()
    .from(skus)
    .where(and(...conditions));
}
