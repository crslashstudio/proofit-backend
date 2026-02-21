/**
 * Placeholder for TikTok order/campaign sync logic.
 * In production, this would call TikTok Shop API to fetch orders and campaigns
 * and upsert into our orders/campaigns tables with workspace isolation.
 */
export declare function syncTikTokOrders(_workspaceId: string, _accessToken: string, _shopId: string, _dateFrom?: Date, _dateTo?: Date): Promise<{
    synced: number;
}>;
export declare function syncTikTokCampaigns(_workspaceId: string, _accessToken: string, _shopId: string): Promise<{
    synced: number;
}>;
//# sourceMappingURL=tiktok.sync.d.ts.map