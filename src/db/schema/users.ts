import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces.js";

export const userRoleEnum = ["owner", "admin", "viewer"] as const;
export type UserRole = (typeof userRoleEnum)[number];

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 255 }).notNull(),
    supabaseUserId: varchar("supabase_user_id", { length: 255 }).notNull(), // Links to Supabase Auth
    role: varchar("role", { length: 20 }).notNull().$type<UserRole>(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  }
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
