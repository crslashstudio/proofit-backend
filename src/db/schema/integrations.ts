import { pgTable, uuid, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces.js";

export const channelEnum = ["tiktok", "shopify", "shopee", "lazada", "tokopedia"] as const;
export type Channel = (typeof channelEnum)[number];

export const integrations = pgTable("integrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  channel: varchar("channel", { length: 50 }).notNull().$type<Channel>(),
  accessToken: varchar("access_token", { length: 2048 }),
  refreshToken: varchar("refresh_token", { length: 2048 }),
  tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }),
  shopId: varchar("shop_id", { length: 255 }),
  shopName: varchar("shop_name", { length: 255 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Integration = typeof integrations.$inferSelect;
export type NewIntegration = typeof integrations.$inferInsert;
