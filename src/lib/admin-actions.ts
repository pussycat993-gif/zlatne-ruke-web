"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "./db";
import { products, shops, reviews, tags } from "./db/schema";
import { requireRole } from "./auth";
import { deleteImages } from "./cloudinary-upload";

export type ActionResult = { ok: boolean; error?: string };

// Skuplja sve Cloudinary public id-eve koji pripadaju radnji i njenoj deci
// (naslovna slika radnje + naslovne i galerijske slike svih proizvoda).
// Mora da se pozove PRE brisanja radnje, jer kaskada briše redove proizvoda.
async function collectShopPublicIds(shopId: string): Promise<string[]> {
  const ids: string[] = [];

  const [shop] = await db
    .select({ coverPublicId: shops.coverPublicId })
    .from(shops)
    .where(eq(shops.id, shopId));
  if (shop?.coverPublicId) ids.push(shop.coverPublicId);

  const shopProducts = await db
    .select({
      imagePublicId: products.imagePublicId,
      imagePublicIds: products.imagePublicIds,
    })
    .from(products)
    .where(eq(products.shopId, shopId));

  for (const p of shopProducts) {
    if (p.imagePublicId) ids.push(p.imagePublicId);
    if (p.imagePublicIds) ids.push(...p.imagePublicIds);
  }

  return ids;
}

// Sve admin akcije prvo proveravaju ulogu. requireRole preusmerava ako nije
// admin, pa do DB poziva dolazi samo ovlašćeni korisnik.

export async function adminDeleteProduct(id: string): Promise<ActionResult> {
  await requireRole(["admin"]);
  try {
    await db.delete(products).where(eq(products.id, id));
    revalidatePath("/admin/proizvodi");
    revalidatePath("/admin");
    revalidatePath("/katalog");
    return { ok: true };
  } catch {
    return { ok: false, error: "Brisanje proizvoda nije uspelo." };
  }
}

export async function adminDeleteShop(id: string): Promise<ActionResult> {
  await requireRole(["admin"]);
  try {
    // Skupi Cloudinary public id-eve dok redovi još postoje (kaskada ih briše).
    const publicIds = await collectShopPublicIds(id);

    // Proizvodi/recenzije/priče radnje se brišu kaskadno (onDelete: cascade).
    await db.delete(shops).where(eq(shops.id, id));

    // Best-effort čišćenje slika sa Cloudinary-ja. deleteImages nikad ne baca,
    // pa neuspeh ne obara akciju — brisanje iz baze je već uspelo.
    await deleteImages(publicIds);

    revalidatePath("/admin/radnje");
    revalidatePath("/admin");
    revalidatePath("/radnje");
    revalidatePath("/katalog");
    return { ok: true };
  } catch {
    return { ok: false, error: "Brisanje radnje nije uspelo." };
  }
}

export async function adminDeleteReview(id: string): Promise<ActionResult> {
  await requireRole(["admin"]);
  try {
    await db.delete(reviews).where(eq(reviews.id, id));
    revalidatePath("/admin/recenzije");
    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false, error: "Brisanje recenzije nije uspelo." };
  }
}

export async function approveTag(id: string): Promise<ActionResult> {
  await requireRole(["admin"]);
  try {
    await db.update(tags).set({ status: "approved" }).where(eq(tags.id, id));
    revalidatePath("/admin/tagovi");
    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false, error: "Odobravanje taga nije uspelo." };
  }
}

export async function rejectTag(id: string): Promise<ActionResult> {
  await requireRole(["admin"]);
  try {
    await db.update(tags).set({ status: "rejected" }).where(eq(tags.id, id));
    revalidatePath("/admin/tagovi");
    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false, error: "Odbijanje taga nije uspelo." };
  }
}
