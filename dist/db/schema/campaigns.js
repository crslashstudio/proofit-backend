import { pgTable, uuid, varchar, timestamp, decimal } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces.js";
export const profitabilityStatusEnum = ["profitable", "breakeven", "loss"];
export const campaigns = pgTable("campaigns", {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
        .notNull()
        .references(() => workspaces.id, { onDelete: "cascade" }),
    campaignId: varchar("campaign_id", { length: 255 }).notNull(), // External platform campaign id
    channel: varchar("channel", { length: 50 }).notNull().$type(),
    campaignName: varchar("campaign_name", { length: 500 }),
    totalRevenue: decimal("total_revenue", { precision: 14, scale: 2 }).notNull().default("0"),
    totalDiscount: decimal("total_discount", { precision: 14, scale: 2 }).notNull().default("0"),
    affiliateCost: decimal("affiliate_cost", { precision: 14, scale: 2 }).notNull().default("0"),
    netProfit: decimal("net_profit", { precision: 14, scale: 2 }).notNull().default("0"),
    profitabilityStatus: varchar("profitability_status", { length: 50 })
        .notNull()
        .$type(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
//# sourceMappingURL=campaigns.js.map