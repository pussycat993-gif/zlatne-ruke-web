import "server-only";
import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "./index";
import {
  products,
  shops,
  reviews,
  favorites,
  follows,
  tags,
} from "./schema";

// ─── Pomoćno: relativno vreme na srpskom ("pre 2h", "pre 3d", "danas") ───
export function relativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "upravo sada";
  if (min < 60) return `pre ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `pre ${h}h`;
  const d = Math.floor(h / 24);
  if (d === 0) return "danas";
  if (d < 30) return `pre ${d}d`;
  const mo = Math.floor(d / 30);
  return `pre ${mo} mes`;
}

// ─── Pregled (dashboard) ───
export type AdminOverview = {
  shopCount: number;
  productCount: number;
  reviewCount: number;
  totalViews: number;
  followCount: number;
  favoriteCount: number;
  newProductsByDay: { label: string; count: number }[];
  recentProducts: {
    id: string;
    name: string;
    shopName: string;
    city: string;
    when: string;
    tone: string;
  }[];
  topShops: {
    id: string;
    name: string;
    city: string;
    products: number;
    followers: number;
    tone: string;
  }[];
};

export async function getAdminOverview(): Promise<AdminOverview> {
  const [
    shopRows,
    prodRows,
    [reviewCountRow],
    [favCountRow],
    [followCountRow],
  ] = await Promise.all([
    db.select().from(shops),
    db.select().from(products).orderBy(desc(products.createdAt)),
    db.select({ c: sql<number>`count(*)::int` }).from(reviews),
    db.select({ c: sql<number>`count(*)::int` }).from(favorites),
    db.select({ c: sql<number>`count(*)::int` }).from(follows),
  ]);

  const shopName = new Map(shopRows.map((s) => [s.id, s.name]));
  const shopCity = new Map(shopRows.map((s) => [s.id, s.city]));

  const productCounts = new Map<string, number>();
  for (const p of prodRows) {
    productCounts.set(p.shopId, (productCounts.get(p.shopId) ?? 0) + 1);
  }

  // Novi proizvodi po danu — poslednjih 14 dana.
  const days = 14;
  const buckets: { label: string; count: number }[] = [];
  const dayMs = 24 * 60 * 60 * 1000;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const start = new Date(todayStart.getTime() - i * dayMs);
    const end = new Date(start.getTime() + dayMs);
    const count = prodRows.filter(
      (p) => p.createdAt >= start && p.createdAt < end,
    ).length;
    buckets.push({ label: `${start.getDate()}.`, count });
  }

  const recentProducts = prodRows.slice(0, 5).map((p) => ({
    id: p.id,
    name: p.name,
    shopName: shopName.get(p.shopId) ?? "—",
    city: shopCity.get(p.shopId) ?? "",
    when: relativeTime(p.createdAt),
    tone: p.tone,
  }));

  const topShops = [...shopRows]
    .sort((a, b) => b.followers - a.followers)
    .slice(0, 5)
    .map((s) => ({
      id: s.id,
      name: s.name,
      city: s.city,
      products: productCounts.get(s.id) ?? 0,
      followers: s.followers,
      tone: s.tone,
    }));

  return {
    shopCount: shopRows.length,
    productCount: prodRows.length,
    reviewCount: Number(reviewCountRow?.c ?? 0),
    totalViews: prodRows.reduce((sum, p) => sum + (p.views ?? 0), 0),
    followCount: Number(followCountRow?.c ?? 0),
    favoriteCount: Number(favCountRow?.c ?? 0),
    newProductsByDay: buckets,
    recentProducts,
    topShops,
  };
}

// ─── Radnje ───
export type AdminShop = {
  id: string;
  name: string;
  owner: string;
  city: string;
  rating: number;
  products: number;
  followers: number;
  tone: string;
  // "aktivna" = ima vlasnika (pravi prodavac); "demo" = seed radnja bez naloga.
  status: "aktivna" | "demo";
};

export async function getAdminShops(): Promise<AdminShop[]> {
  const [shopRows, prodRows] = await Promise.all([
    db.select().from(shops).orderBy(desc(shops.followers)),
    db.select({ shopId: products.shopId }).from(products),
  ]);
  const counts = new Map<string, number>();
  for (const p of prodRows) {
    counts.set(p.shopId, (counts.get(p.shopId) ?? 0) + 1);
  }
  return shopRows.map((s) => ({
    id: s.id,
    name: s.name,
    owner: s.owner,
    city: s.city,
    rating: s.rating,
    products: counts.get(s.id) ?? 0,
    followers: s.followers,
    tone: s.tone,
    status: s.ownerId ? "aktivna" : "demo",
  }));
}

// ─── Proizvodi ───
export type AdminProduct = {
  id: string;
  name: string;
  price: number;
  shopName: string;
  city: string;
  when: string;
  tone: string;
};

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      tone: products.tone,
      createdAt: products.createdAt,
      shopName: shops.name,
      city: shops.city,
    })
    .from(products)
    .innerJoin(shops, eq(products.shopId, shops.id))
    .orderBy(desc(products.createdAt));
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    price: r.price,
    shopName: r.shopName,
    city: r.city,
    when: relativeTime(r.createdAt),
    tone: r.tone,
  }));
}

// ─── Recenzije (sa nazivom radnje; "prijavljeno" = niska ocena) ───
export type AdminReview = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  shopName: string;
  flagged: boolean;
};

export async function getAdminReviews(): Promise<AdminReview[]> {
  const rows = await db
    .select({
      id: reviews.id,
      author: reviews.author,
      rating: reviews.rating,
      text: reviews.text,
      dateLabel: reviews.dateLabel,
      createdAt: reviews.createdAt,
      shopName: shops.name,
    })
    .from(reviews)
    .innerJoin(shops, eq(reviews.shopId, shops.id))
    .orderBy(desc(reviews.createdAt));
  return rows.map((r) => ({
    id: r.id,
    author: r.author,
    rating: r.rating,
    text: r.text,
    date: r.dateLabel || relativeTime(r.createdAt),
    shopName: r.shopName,
    flagged: r.rating <= 2,
  }));
}

// ─── Kupci (izvedeno iz aktivnosti — nema zasebne tabele kupaca) ───
export type AdminBuyers = {
  reviewers: number;
  followers: number;
  favorites: number;
  topBuyers: { name: string; reviews: number; lastDate: string }[];
};

export async function getAdminBuyers(): Promise<AdminBuyers> {
  const [[reviewersRow], [followsRow], [favRow], reviewRows] =
    await Promise.all([
      db
        .select({ c: sql<number>`count(distinct ${reviews.authorId})::int` })
        .from(reviews)
        .where(isNotNull(reviews.authorId)),
      db.select({ c: sql<number>`count(*)::int` }).from(follows),
      db.select({ c: sql<number>`count(*)::int` }).from(favorites),
      db
        .select({
          author: reviews.author,
          dateLabel: reviews.dateLabel,
          createdAt: reviews.createdAt,
        })
        .from(reviews)
        .orderBy(desc(reviews.createdAt)),
    ]);

  // Grupiši recenzije po imenu autora → najaktivniji kupci.
  const byAuthor = new Map<string, { reviews: number; lastDate: string }>();
  for (const r of reviewRows) {
    const cur = byAuthor.get(r.author);
    if (cur) {
      cur.reviews += 1;
    } else {
      byAuthor.set(r.author, {
        reviews: 1,
        lastDate: r.dateLabel || relativeTime(r.createdAt),
      });
    }
  }
  const topBuyers = [...byAuthor.entries()]
    .map(([name, v]) => ({ name, reviews: v.reviews, lastDate: v.lastDate }))
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 8);

  return {
    reviewers: Number(reviewersRow?.c ?? 0),
    followers: Number(followsRow?.c ?? 0),
    favorites: Number(favRow?.c ?? 0),
    topBuyers,
  };
}

// ─── Tagovi ───
export type AdminTag = {
  id: string;
  name: string;
  groupLabel: string;
  proposedByName: string;
  when: string;
};

export type TagStats = {
  pending: number;
  approved: number;
  rejected: number;
};

export async function getTagStats(): Promise<TagStats> {
  const rows = await db
    .select({ status: tags.status, c: sql<number>`count(*)::int` })
    .from(tags)
    .groupBy(tags.status);
  const stats: TagStats = { pending: 0, approved: 0, rejected: 0 };
  for (const r of rows) {
    stats[r.status] = Number(r.c);
  }
  return stats;
}

export async function getPendingTags(): Promise<AdminTag[]> {
  const rows = await db
    .select()
    .from(tags)
    .where(eq(tags.status, "pending"))
    .orderBy(desc(tags.createdAt));
  return rows.map((t) => ({
    id: t.id,
    name: t.name,
    groupLabel: t.groupLabel,
    proposedByName: t.proposedByName,
    when: relativeTime(t.createdAt),
  }));
}

// Broj tagova na čekanju (za badge u navigaciji).
export async function getPendingTagCount(): Promise<number> {
  const [row] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(tags)
    .where(eq(tags.status, "pending"));
  return Number(row?.c ?? 0);
}

// Broj recenzija "za moderaciju" (niska ocena ≤ 2) — za badge.
export async function getFlaggedReviewCount(): Promise<number> {
  const [row] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(reviews)
    .where(and(sql`${reviews.rating} <= 2`));
  return Number(row?.c ?? 0);
}
