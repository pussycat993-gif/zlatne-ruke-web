import "server-only";
import { eq, sql } from "drizzle-orm";
import { db } from "./db";
import { products, shops } from "./db/schema";

// Beleži pregled (ne ruši render ako padne; ne broji se ako gleda vlasnik).
export async function incrementProductViews(id: string) {
  try {
    await db
      .update(products)
      .set({ views: sql`${products.views} + 1` })
      .where(eq(products.id, id));
  } catch {
    /* ignoriši */
  }
}

export async function incrementShopViews(id: string) {
  try {
    await db
      .update(shops)
      .set({ views: sql`${shops.views} + 1` })
      .where(eq(shops.id, id));
  } catch {
    /* ignoriši */
  }
}
