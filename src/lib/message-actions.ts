"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { conversations, messages, shops } from "./db/schema";
import { getOrCreateConversation } from "./messages";

// „Pošalji upit majstorici" — kupac otvara (ili nastavlja) razgovor sa radnjom.
export async function startConversation(formData: FormData) {
  const { userId } = await auth();
  const shopId = String(formData.get("shopId") ?? "").trim();
  if (!userId) redirect("/login");
  if (!shopId) redirect("/katalog");

  const conversationId = await getOrCreateConversation(userId, shopId);
  redirect(`/profil/poruke/${conversationId}`);
}

export type MsgState = { ok: boolean; error?: string };

// Šalje poruku u razgovor (kupac ili vlasnik radnje).
export async function sendMessage(
  _prev: MsgState,
  formData: FormData,
): Promise<MsgState> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "Niste prijavljeni." };

  const conversationId = String(formData.get("conversationId") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!conversationId) return { ok: false, error: "Nedostaje razgovor." };
  if (!body) return { ok: false, error: "Poruka je prazna." };

  const [c] = await db
    .select({ buyerId: conversations.buyerId, ownerId: shops.ownerId })
    .from(conversations)
    .innerJoin(shops, eq(conversations.shopId, shops.id))
    .where(eq(conversations.id, conversationId))
    .limit(1);
  if (!c || (c.buyerId !== userId && c.ownerId !== userId)) {
    return { ok: false, error: "Nemate pristup ovom razgovoru." };
  }

  const isOwner = c.ownerId === userId;
  const now = new Date();
  await db.insert(messages).values({ conversationId, senderId: userId, body });
  await db
    .update(conversations)
    .set({
      lastMessageAt: now,
      lastSenderId: userId,
      // pošiljalac je „pročitao" do sada
      ...(isOwner ? { sellerLastReadAt: now } : { buyerLastReadAt: now }),
    })
    .where(eq(conversations.id, conversationId));

  revalidatePath(`/profil/poruke/${conversationId}`);
  revalidatePath(`/prodavac/poruke/${conversationId}`);
  revalidatePath("/profil/poruke");
  revalidatePath("/prodavac/poruke");
  return { ok: true };
}
