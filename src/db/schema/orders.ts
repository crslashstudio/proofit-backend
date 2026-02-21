import { pgTable, uuid, varchar, timestamp, decimal, date } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces.js";
import { skus } from "./skus.js";
import type { Channel } from "./integrations.js";

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  channel: varchar("channel", { length: 50 }).notNull().$type<Channel>(),
  orderId: varchar("order_id", { length: 255 }).notNull(), // External platform order id
  skuId: uuid("sku_id").references(() => skus.id),
  revenue: decimal("revenue", { precision: 14, scale: 2 }).notNull().default("0"),
  discount: decimal("discount", { precision: 14, scale: 2 }).notNull().default("0"),
  platformFee: decimal("platform_fee", { precision: 14, scale: 2 }).notNull().default("0"),
  affiliateFee: decimal("affiliate_fee", { precision: 14, scale: 2 }).notNull().default("0"),
  shippingCost: decimal("shipping_cost", { precision: 14, scale: 2 }).notNull().default("0"),
  adsCost: decimal("ads_cost", { precision: 14, scale: 2 }).notNull().default("0"),
  cogs: decimal("cogs", { precision: 14, scale: 2 }).notNull().default("0"),
  netProfit: decimal("net_profit", { precision: 14, scale: 2 }).notNull().default("0"),
  orderDate: date("order_date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
