import type { Channel } from "../../db/schema/integrations.js";
export interface ListOrdersQuery {
    workspaceId: string;
    channel?: Channel;
    dateFrom?: string;
    dateTo?: string;
}
export declare function listOrders(query: ListOrdersQuery): Promise<{
    workspaceId: string;
    id: string;
    createdAt: Date;
    channel: "tiktok" | "shopify" | "shopee" | "lazada" | "tokopedia";
    orderId: string;
    skuId: string | null;
    revenue: string;
    discount: string;
    platformFee: string;
    affiliateFee: string;
    shippingCost: string;
    adsCost: string;
    cogs: string;
    netProfit: string;
    orderDate: string;
}[]>;
//# sourceMappingURL=orders.service.d.ts.map