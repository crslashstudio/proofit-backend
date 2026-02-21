import type { Channel } from "../../db/schema/integrations.js";
import type { SkuClassification } from "../../db/schema/skus.js";
export interface ListSkusQuery {
    workspaceId: string;
    channel?: Channel;
    classification?: SkuClassification;
}
export declare function listSkus(query: ListSkusQuery): Promise<{
    workspaceId: string;
    id: string;
    createdAt: Date;
    channel: "tiktok" | "shopify" | "shopee" | "lazada" | "tokopedia";
    skuCode: string;
    productName: string | null;
    inventoryLevel: number;
    productionCost: string | null;
    classification: "star" | "hidden_gem" | "illusion_bestseller" | "cash_burner" | null;
    riskScore: string | null;
}[]>;
//# sourceMappingURL=skus.service.d.ts.map