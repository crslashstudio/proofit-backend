import { supabase } from "../../db/client.js";
export async function listOrders(query) {
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
//# sourceMappingURL=orders.service.js.map