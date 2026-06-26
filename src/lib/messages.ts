import "server-only";
import { and, asc, desc, eq } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { conversations, messages, shops } from "./db/schema";
import { getOrCreateSellerShop } from "./seller";

// Nađe ili kreira razgovor kupca sa radnjom; vraća id razgovora.
export async function getOrCreateConversation(
  buyerId: string,
  shopId: string,
): Promise<string> {
  const [existing] = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(
      and(eq(conversations.buyerId, buyerId), eq(conversations.shopId, shopId)),
    )
    .limit(1);
  if (existing) return existing.id;

  const user = await currentUser();
  const buyerName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    "Kupac";

  const [created] = await db
    .insert(conversations)
    .values({ buyerId, shopId, buyerName })
    .onConflictDoNothing({
      target: [conversations.buyerId, conversations.shopId],
    })
    .returning({ id: conversations.id });
  if (created) return created.id;

  const [again] = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(
      and(eq(conversations.buyerId, buyerId), eq(conversations.shopId, shopId)),
    )
    .limit(1);
  return again.id;
}

export type ConversationListItem = {
  id: string;
  title: string;
  lastMessageAt: Date;
  unread: boolean;
};

// Nepročitano za posmatrača: poslednju poruku je poslao neko drugi i to
// posle poslednjeg čitanja posmatrača.
function isUnread(
  lastSenderId: string | null,
  viewerId: string,
  lastMessageAt: Date,
  lastReadAt: Date | null,
): boolean {
  if (!lastSenderId || lastSenderId === viewerId) return false;
  if (!lastReadAt) return true;
  return lastMessageAt.getTime() > lastReadAt.getTime();
}

// Razgovori trenutnog kupca (naslov = naziv radnje).
export async function getBuyerConversations(): Promise<ConversationListItem[]> {
  const { userId } = await auth();
  if (!userId) return [];
  const rows = await db
    .select({
      id: conversations.id,
      title: shops.name,
      lastMessageAt: conversations.lastMessageAt,
      lastSenderId: conversations.lastSenderId,
      lastReadAt: conversations.buyerLastReadAt,
    })
    .from(conversations)
    .innerJoin(shops, eq(conversations.shopId, shops.id))
    .where(eq(conversations.buyerId, userId))
    .orderBy(desc(conversations.lastMessageAt));
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    lastMessageAt: r.lastMessageAt,
    unread: isUnread(r.lastSenderId, userId, r.lastMessageAt, r.lastReadAt),
  }));
}

// Razgovori radnje trenutnog prodavca (naslov = ime kupca).
export async function getSellerConversations(): Promise<ConversationListItem[]> {
  const { userId } = await auth();
  const shop = await getOrCreateSellerShop();
  if (!shop || !userId) return [];
  const rows = await db
    .select({
      id: conversations.id,
      title: conversations.buyerName,
      lastMessageAt: conversations.lastMessageAt,
      lastSenderId: conversations.lastSenderId,
      lastReadAt: conversations.sellerLastReadAt,
    })
    .from(conversations)
    .where(eq(conversations.shopId, shop.id))
    .orderBy(desc(conversations.lastMessageAt));
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    lastMessageAt: r.lastMessageAt,
    unread: isUnread(r.lastSenderId, userId, r.lastMessageAt, r.lastReadAt),
  }));
}

export async function getBuyerUnreadCount(): Promise<number> {
  const list = await getBuyerConversations();
  return list.filter((c) => c.unread).length;
}

export async function getSellerUnreadCount(): Promise<number> {
  const list = await getSellerConversations();
  return list.filter((c) => c.unread).length;
}

export type ConversationDetail = {
  id: string;
  shopId: string;
  shopName: string;
  buyerName: string;
  viewerRole: "buyer" | "seller";
  messages: { id: string; body: string; createdAt: Date; mine: boolean }[];
};

// Razgovor + poruke, uz proveru pristupa (kupac ili vlasnik radnje).
export async function getConversationForViewer(
  id: string,
): Promise<ConversationDetail | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const [c] = await db
    .select({
      id: conversations.id,
      buyerId: conversations.buyerId,
      buyerName: conversations.buyerName,
      shopId: conversations.shopId,
      shopName: shops.name,
      shopOwnerId: shops.ownerId,
    })
    .from(conversations)
    .innerJoin(shops, eq(conversations.shopId, shops.id))
    .where(eq(conversations.id, id))
    .limit(1);
  if (!c) return null;

  const isBuyer = c.buyerId === userId;
  const isOwner = c.shopOwnerId === userId;
  if (!isBuyer && !isOwner) return null;

  // Otvaranje razgovora = pročitano za posmatrača.
  await db
    .update(conversations)
    .set(isOwner ? { sellerLastReadAt: new Date() } : { buyerLastReadAt: new Date() })
    .where(eq(conversations.id, id));

  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(asc(messages.createdAt));

  return {
    id: c.id,
    shopId: c.shopId,
    shopName: c.shopName,
    buyerName: c.buyerName,
    viewerRole: isOwner ? "seller" : "buyer",
    messages: msgs.map((m) => ({
      id: m.id,
      body: m.body,
      createdAt: m.createdAt,
      mine: m.senderId === userId,
    })),
  };
}
