export declare function listByWorkspace(workspaceId: string): Promise<{
    id: string;
    channel: "tiktok" | "shopify" | "shopee" | "lazada" | "tokopedia";
    shopId: string | null;
    shopName: string | null;
    isActive: boolean;
    createdAt: Date;
}[]>;
export declare function upsertTikTokIntegration(workspaceId: string, data: {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
    shopId?: string;
    shopName?: string;
}): Promise<{
    workspaceId: string;
    id: string;
    createdAt: Date;
    channel: "tiktok" | "shopify" | "shopee" | "lazada" | "tokopedia";
    accessToken: string | null;
    refreshToken: string | null;
    tokenExpiresAt: Date | null;
    shopId: string | null;
    shopName: string | null;
    isActive: boolean;
}>;
export declare function getIntegrationById(id: string, workspaceId: string): Promise<{
    workspaceId: string;
    id: string;
    createdAt: Date;
    channel: "tiktok" | "shopify" | "shopee" | "lazada" | "tokopedia";
    accessToken: string | null;
    refreshToken: string | null;
    tokenExpiresAt: Date | null;
    shopId: string | null;
    shopName: string | null;
    isActive: boolean;
}>;
//# sourceMappingURL=integrations.service.d.ts.map