import { db } from "../../db/client.js";
import { orders } from "../../db/schema/orders.js";
import { eq, and, gte, lte } from "drizzle-orm";
import type { Channel } from "../../db/schema/integrations.js";

export interface ListOrdersQuery {
  workspaceId: string;
  channel?: Channel;
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string;
}

export async function listOrders(query: ListOrdersQuery) {
  const conditions = [eq(orders.workspaceId, query.workspaceId)];
  if (query.channel) conditions.push(eq(orders.channel, query.channel));
  if (query.dateFrom) conditions.push(gte(orders.orderDate, query.dateFrom));
  if (query.dateTo) conditions.push(lte(orders.orderDate, query.dateTo));
  return db
    .select()
    .from(orders)
    .where(and(...conditions));
}
