import type { Channel } from "../../db/schema/integrations.js";
import type { SkuClassification } from "../../db/schema/skus.js";
export interface ListSkusQuery {
    workspaceId: string;
    channel?: Channel;
    classification?: SkuClassification;
}
export declare function listSkus(query: ListSkusQuery): Promise<any[]>;
//# sourceMappingURL=skus.service.d.ts.map