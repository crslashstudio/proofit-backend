import { db } from "../../db/client.js";
import { integrations } from "../../db/schema/integrations.js";
import { eq, and } from "drizzle-orm";
import type { Channel } from "../../db/schema/integrations.js";

export async function listByWorkspace(workspaceId: string) {
  return db
    .select({
      id: integrations.id,
      channel: integrations.channel,
      shopId: integrations.shopId,
      shopName: integrations.shopName,
      isActive: integrations.isActive,
      createdAt: integrations.createdAt,
    })
    .from(integrations)
    .where(eq(integrations.workspaceId, workspaceId));
}

export async function upsertTikTokIntegration(
  workspaceId: string,
  data: {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
    shopId?: string;
    shopName?: string;
  }
) {
  const tokenExpiresAt = new Date(Date.now() + data.expiresIn * 1000);
  const existing = await db
    .select()
    .from(integrations)
    .where(
      and(
        eq(integrations.workspaceId, workspaceId),
        eq(integrations.channel, "tiktok" as Channel)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    const [updated] = await db
      .update(integrations)
      .set({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken ?? null,
        tokenExpiresAt,
        shopId: data.shopId ?? existing[0].shopId,
        shopName: data.shopName ?? existing[0].shopName,
        isActive: true,
      })
      .where(eq(integrations.id, existing[0].id))
      .returning();
    return updated;
  }

  const [inserted] = await db
    .insert(integrations)
    .values({
      workspaceId,
      channel: "tiktok" as const,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? null,
      tokenExpiresAt,
      shopId: data.shopId ?? null,
      shopName: data.shopName ?? null,
      isActive: true,
    })
    .returning();
  return inserted;
}

export async function getIntegrationById(
  id: string,
  workspaceId: string
) {
  const [row] = await db
    .select()
    .from(integrations)
    .where(
      and(eq(integrations.id, id), eq(integrations.workspaceId, workspaceId))
    )
    .limit(1);
  return row ?? null;
}
