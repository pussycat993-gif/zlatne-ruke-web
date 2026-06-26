"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { products, reviews, shops } from "./db/schema";

export type ReviewState = { ok: boolean; error?: string };

// Preračunava prosečnu ocenu i broj recenzija za proizvod i radnju.
async function recompute(productId: string, shopId: string) {
  const [p] = await db
    .select({
      avg: sql<number>`coalesce(avg(${reviews.rating}), 0)`,
      cnt: sql<number>`count(*)::int`,
    })
    .from(reviews)
    .where(eq(reviews.productId, productId));
  await db
    .update(products)
    .set({
      rating: Math.round(Number(p.avg) * 10) / 10,
      reviewCount: Number(p.cnt),
    })
    .where(eq(products.id, productId));

  const [s] = await db
    .select({
      avg: sql<number>`coalesce(avg(${reviews.rating}), 0)`,
      cnt: sql<number>`count(*)::int`,
    })
    .from(reviews)
    .where(eq(reviews.shopId, shopId));
  await db
    .update(shops)
    .set({
      rating: Math.round(Number(s.avg) * 10) / 10,
      reviews: Number(s.cnt),
    })
    .where(eq(shops.id, shopId));
}

// Kupac ostavlja (ili menja) recenziju proizvoda.
export async function createReview(
  _prev: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const productId = String(formData.get("productId") ?? "").trim();
  const rating = Number(formData.get("rating"));
  const text = String(formData.get("text") ?? "").trim();

  if (!productId) return { ok: false, error: "Nedostaje proizvod." };
  if (!(rating >= 1 && rating <= 5))
    return { ok: false, error: "Izaberi ocenu (1–5 zvezdica)." };
  if (!text) return { ok: false, error: "Napiši par reči o proizvodu." };

  const [prod] = await db
    .select({ shopId: products.shopId })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);
  if (!prod) return { ok: false, error: "Proizvod ne postoji." };

  const user = await currentUser();
  const author =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "Kupac";

  await db
    .insert(reviews)
    .values({
      productId,
      shopId: prod.shopId,
      authorId: userId,
      author,
      rating,
      text,
      dateLabel: "danas",
    })
    .onConflictDoUpdate({
      target: [reviews.authorId, reviews.productId],
      set: { rating, text, author, dateLabel: "danas" },
    });

  await recompute(productId, prod.shopId);

  revalidatePath(`/proizvod/${productId}`);
  revalidatePath(`/radnja/${prod.shopId}`);
  revalidatePath("/katalog");
  return { ok: true };
}
