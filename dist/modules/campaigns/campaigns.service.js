import { db } from "../../db/client.js";
import { campaigns } from "../../db/schema/campaigns.js";
import { eq, and } from "drizzle-orm";
export async function listCampaigns(query) {
    const conditions = [eq(campaigns.workspaceId, query.workspaceId)];
    if (query.channel)
        conditions.push(eq(campaigns.channel, query.channel));
    return db
        .select()
        .from(campaigns)
        .where(and(...conditions));
}
//# sourceMappingURL=campaigns.service.js.map