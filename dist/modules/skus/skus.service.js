import { db } from "../../db/client.js";
import { skus } from "../../db/schema/skus.js";
import { eq, and } from "drizzle-orm";
export async function listSkus(query) {
    const conditions = [eq(skus.workspaceId, query.workspaceId)];
    if (query.channel)
        conditions.push(eq(skus.channel, query.channel));
    if (query.classification)
        conditions.push(eq(skus.classification, query.classification));
    return db
        .select()
        .from(skus)
        .where(and(...conditions));
}
//# sourceMappingURL=skus.service.js.map