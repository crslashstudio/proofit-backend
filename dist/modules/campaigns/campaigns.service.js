import { supabase } from "../../db/client.js";
export async function listCampaigns(query) {
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
//# sourceMappingURL=campaigns.service.js.map