import type { Channel } from "../../db/schema/integrations.js";
export interface ListCampaignsQuery {
    workspaceId: string;
    channel?: Channel;
}
export declare function listCampaigns(query: ListCampaignsQuery): Promise<any[]>;
//# sourceMappingURL=campaigns.service.d.ts.map