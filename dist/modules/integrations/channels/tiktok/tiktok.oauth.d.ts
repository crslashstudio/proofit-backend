export declare function getTikTokAuthorizeUrl(state: string): string;
export declare function exchangeTikTokCode(code: string, appKey: string, appSecret: string, redirectUri: string): Promise<{
    access_token: string;
    refresh_token?: string;
    expires_in: number;
}>;
//# sourceMappingURL=tiktok.oauth.d.ts.map