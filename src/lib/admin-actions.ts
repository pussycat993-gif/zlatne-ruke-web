"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "./db";
import { products, shops, reviews, tags } from "./db/schema";
import { requireRole } from "./auth";

export type ActionResult = { ok: boolean; error?: string };

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
    // Proizvodi/recenzije/priče radnje se brišu kaskadno (onDelete: cascade).
    await db.delete(shops).where(eq(shops.id, id));
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
