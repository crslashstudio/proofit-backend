export declare function listByWorkspace(workspaceId: string): Promise<{
    id: any;
    channel: any;
    shopId: any;
    shopName: any;
    isActive: any;
    createdAt: any;
}[]>;
export declare function upsertTikTokIntegration(workspaceId: string, data: {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
    shopId?: string;
    shopName?: string;
}): Promise<any>;
export declare function getIntegrationById(id: string, workspaceId: string): Promise<any>;
//# sourceMappingURL=integrations.service.d.ts.map