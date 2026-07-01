import "server-only";
import { eq } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { shops } from "./db/schema";

export type ShopRow = typeof shops.$inferSelect;

// Vraća radnju ulogovanog prodavca; ako je nema, lazy je kreira (idempotentno
// preko unique indeksa na owner_id). Prodavac uvek dobije „svoju" radnju.
export async function getOrCreateSellerShop(): Promise<ShopRow | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  const firstName = user?.firstName ?? "";
  const name = firstName ? `${firstName} - radnja` : "Moja radnja";
  const owner =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Vlasnica";

  // Pokušaj kreiranja; ako radnja za ovaj nalog već postoji, ne radi ništa.
  await db
    .insert(shops)
    .values({
      ownerId: userId,
      name,
      owner,
      city: "Srbija",
      category: "tekstil",
      tone: "v2",
      bio: "",
    })
    .onConflictDoNothing({ target: shops.ownerId });

  const [shop] = await db
    .select()
    .from(shops)
    .where(eq(shops.ownerId, userId))
    .limit(1);

  return shop ?? null;
}
