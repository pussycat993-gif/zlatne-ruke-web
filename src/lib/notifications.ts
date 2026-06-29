import "server-only";
import { and, desc, eq, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { notifications } from "./db/schema";

export type NotificationType = "follow" | "review" | "message";

// Kreira obaveštenje za korisnika (poziva se iz server akcija).
export async function createNotification(opts: {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  href?: string;
}) {
  try {
    await db.insert(notifications).values({
      userId: opts.userId,
      type: opts.type,
      title: opts.title,
      body: opts.body ?? "",
      href: opts.href ?? "",
    });
  } catch (e) {
    console.error("Obaveštenje nije sačuvano:", e);
  }
}

export type NotificationRow = typeof notifications.$inferSelect;

export async function getNotifications(): Promise<NotificationRow[]> {
  const { userId } = await auth();
  if (!userId) return [];
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(50);
}

export async function getUnreadNotificationCount(): Promise<number> {
  const { userId } = await auth();
  if (!userId) return 0;
  const [r] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(notifications)
    .where(
      and(eq(notifications.userId, userId), eq(notifications.read, false)),
    );
  return Number(r?.c ?? 0);
}

// Označava sva nepročitana kao pročitana (poziva se pri otvaranju strane).
export async function markNotificationsRead() {
  const { userId } = await auth();
  if (!userId) return;
  await db
    .update(notifications)
    .set({ read: true })
    .where(
      and(eq(notifications.userId, userId), eq(notifications.read, false)),
    );
}
