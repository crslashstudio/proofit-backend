import { supabase } from "../../db/client.js";
import type { Channel } from "../../db/schema/integrations.js";

export interface ListOrdersQuery {
  workspaceId: string;
  channel?: Channel;
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string;
}

export async function listOrders(query: ListOrdersQuery) {
  let queryBuilder = supabase
    .from("orders")
    .select("*")
    .eq("workspace_id", query.workspaceId);

  if (query.channel) {
    queryBuilder = queryBuilder.eq("channel", query.channel);
  }
  if (query.dateFrom) {
    queryBuilder = queryBuilder.gte("order_date", query.dateFrom);
  }
  if (query.dateTo) {
    queryBuilder = queryBuilder.lte("order_date", query.dateTo);
  }

  const { data, error } = await queryBuilder;

  if (error) {
    console.error("[orders.service] listOrders failed:", error.message);
    throw new Error(error.message);
  }

  return data;
}
