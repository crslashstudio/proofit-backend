import type { Channel } from "../../db/schema/integrations.js";
export interface ListCampaignsQuery {
    workspaceId: string;
    channel?: Channel;
}
export declare function listCampaigns(query: ListCampaignsQuery): Promise<{
    workspaceId: string;
    id: string;
    createdAt: Date;
    channel: "tiktok" | "shopify" | "shopee" | "lazada" | "tokopedia";
    netProfit: string;
    campaignId: string;
    campaignName: string | null;
    totalRevenue: string;
    totalDiscount: string;
    affiliateCost: string;
    profitabilityStatus: "profitable" | "breakeven" | "loss";
}[]>;
//# sourceMappingURL=campaigns.service.d.ts.map