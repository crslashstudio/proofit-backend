import type { Channel } from "../../db/schema/integrations.js";
export interface ListOrdersQuery {
    workspaceId: string;
    channel?: Channel;
    dateFrom?: string;
    dateTo?: string;
}
export declare function listOrders(query: ListOrdersQuery): Promise<any[]>;
//# sourceMappingURL=orders.service.d.ts.map