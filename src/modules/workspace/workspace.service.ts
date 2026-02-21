import { db } from "../../db/client.js";
import { workspaces } from "../../db/schema/workspaces.js";
import { eq } from "drizzle-orm";

export async function getWorkspaceById(workspaceId: string) {
  const [w] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);
  return w ?? null;
}
