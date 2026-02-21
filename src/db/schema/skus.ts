import { pgTable, uuid, varchar, timestamp, decimal, integer } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces.js";
import type { Channel } from "./integrations.js";

export const classificationEnum = [
  "star",
  "hidden_gem",
  "illusion_bestseller",
  "cash_burner",
] as const;
export type SkuClassification = (typeof classificationEnum)[number];

export const skus = pgTable("skus", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  skuCode: varchar("sku_code", { length: 100 }).notNull(),
  productName: varchar("product_name", { length: 500 }),
  channel: varchar("channel", { length: 50 }).notNull().$type<Channel>(),
  inventoryLevel: integer("inventory_level").default(0).notNull(),
  productionCost: decimal("production_cost", { precision: 14, scale: 2 }).default("0"),
  classification: varchar("classification", { length: 50 }).$type<SkuClassification>(),
  riskScore: decimal("risk_score", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Sku = typeof skus.$inferSelect;
export type NewSku = typeof skus.$inferInsert;
