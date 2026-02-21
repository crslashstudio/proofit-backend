/**
 * Placeholder for TikTok order/campaign sync logic.
 * In production, this would call TikTok Shop API to fetch orders and campaigns
 * and upsert into our orders/campaigns tables with workspace isolation.
 */
export async function syncTikTokOrders(_workspaceId, _accessToken, _shopId, _dateFrom, _dateTo) {
    return { synced: 0 };
}
export async function syncTikTokCampaigns(_workspaceId, _accessToken, _shopId) {
    return { synced: 0 };
}
//# sourceMappingURL=tiktok.sync.js.map