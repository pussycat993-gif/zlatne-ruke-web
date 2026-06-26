import "server-only";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { favorites, follows, products } from "./db/schema";
import type { Product } from "./data";

// Set id-eva proizvoda koje je trenutni korisnik dodao u omiljeno.
export async function getFavoriteProductIds(): Promise<Set<string>> {
  const { userId } = await auth();
  if (!userId) return new Set();
  const rows = await db
    .select({ id: favorites.productId })
    .from(favorites)
    .where(eq(favorites.userId, userId));
  return new Set(rows.map((r) => r.id));
}

// Set id-eva radnji koje trenutni korisnik prati.
export async function getFollowedShopIds(): Promise<Set<string>> {
  const { userId } = await auth();
  if (!userId) return new Set();
  const rows = await db
    .select({ id: follows.shopId })
    .from(follows)
    .where(eq(follows.userId, userId));
  return new Set(rows.map((r) => r.id));
}

export async function isFollowingShop(shopId: string): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;
  const [row] = await db
    .select({ id: follows.id })
    .from(follows)
    .where(and(eq(follows.userId, userId), eq(follows.shopId, shopId)))
    .limit(1);
  return Boolean(row);
}

// Omiljeni proizvodi trenutnog korisnika (za /profil/omiljeno).
export async function getFavoriteProducts(): Promise<Product[]> {
  const { userId } = await auth();
  if (!userId) return [];
  const rows = await db
    .select({ p: products })
    .from(favorites)
    .innerJoin(products, eq(favorites.productId, products.id))
    .where(eq(favorites.userId, userId));
  return rows.map(({ p }) => ({
    id: p.id,
    shopId: p.shopId,
    name: p.name,
    price: p.price,
    oldPrice: p.oldPrice ?? undefined,
    category: p.category,
    tone: p.tone,
    rating: p.rating,
    reviewCount: p.reviewCount,
    inStock: p.inStock,
    desc: p.description,
    imagePublicId: p.imagePublicId,
    imagePublicIds: p.imagePublicIds,
  }));
}
