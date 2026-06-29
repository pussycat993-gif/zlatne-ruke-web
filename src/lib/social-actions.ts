"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { favorites, follows, shops } from "./db/schema";
import { createNotification } from "./notifications";

export type ToggleResult = { ok: boolean; active: boolean; needsAuth?: boolean };

// Dodaje/uklanja proizvod iz omiljenih trenutnog korisnika.
export async function toggleFavorite(productId: string): Promise<ToggleResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, active: false, needsAuth: true };

  const [existing] = await db
    .select({ id: favorites.id })
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.productId, productId)))
    .limit(1);

  let active: boolean;
  if (existing) {
    await db.delete(favorites).where(eq(favorites.id, existing.id));
    active = false;
  } else {
    await db
      .insert(favorites)
      .values({ userId, productId })
      .onConflictDoNothing();
    active = true;
  }

  revalidatePath("/profil/omiljeno");
  revalidatePath(`/proizvod/${productId}`);
  return { ok: true, active };
}

// Prati/otprati radnju; usput ažurira brojač pratilaca na radnji.
export async function toggleFollow(shopId: string): Promise<ToggleResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, active: false, needsAuth: true };

  const [existing] = await db
    .select({ id: follows.id })
    .from(follows)
    .where(and(eq(follows.userId, userId), eq(follows.shopId, shopId)))
    .limit(1);

  let active: boolean;
  if (existing) {
    await db.delete(follows).where(eq(follows.id, existing.id));
    await db
      .update(shops)
      .set({ followers: sql`GREATEST(${shops.followers} - 1, 0)` })
      .where(eq(shops.id, shopId));
    active = false;
  } else {
    await db.insert(follows).values({ userId, shopId }).onConflictDoNothing();
    await db
      .update(shops)
      .set({ followers: sql`${shops.followers} + 1` })
      .where(eq(shops.id, shopId));
    active = true;

    // Obavesti vlasnicu radnje o novom pratiocu.
    const [shop] = await db
      .select({ ownerId: shops.ownerId })
      .from(shops)
      .where(eq(shops.id, shopId))
      .limit(1);
    if (shop?.ownerId && shop.ownerId !== userId) {
      const u = await currentUser();
      const who =
        [u?.firstName, u?.lastName].filter(Boolean).join(" ") ||
        u?.username ||
        "Neko";
      await createNotification({
        userId: shop.ownerId,
        type: "follow",
        title: `${who} prati tvoju radnju`,
        href: "/prodavac",
      });
    }
  }

  revalidatePath(`/radnja/${shopId}`);
  revalidatePath("/radnje");
  return { ok: true, active };
}
