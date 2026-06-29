import { and, asc, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";
import { db } from "./index";
import { products, shops, reviews, stories, categories } from "./schema";
import type { Category, Product, Review, Shop, Story } from "@/lib/data";

// Mapiranje DB redova → tipovi koje komponente već koriste (data.ts),
// da prelazak sa seed-a na bazu ne dira UI komponente.
type ProductRow = typeof products.$inferSelect;
type ShopRow = typeof shops.$inferSelect;
type ReviewRow = typeof reviews.$inferSelect;
type StoryRow = typeof stories.$inferSelect;
type CategoryRow = typeof categories.$inferSelect;

function toProduct(r: ProductRow): Product {
  return {
    id: r.id,
    shopId: r.shopId,
    name: r.name,
    price: r.price,
    oldPrice: r.oldPrice ?? undefined,
    category: r.category,
    tone: r.tone,
    rating: r.rating,
    reviewCount: r.reviewCount,
    inStock: r.inStock,
    desc: r.description,
    imagePublicId: r.imagePublicId,
    imagePublicIds: r.imagePublicIds,
    views: r.views,
  };
}

function toShop(r: ShopRow): Shop {
  return {
    id: r.id,
    ownerId: r.ownerId,
    name: r.name,
    owner: r.owner,
    city: r.city,
    rating: r.rating,
    reviews: r.reviews,
    followers: r.followers,
    category: r.category,
    tone: r.tone,
    bio: r.bio,
    coverPublicId: r.coverPublicId,
  };
}

function toReview(r: ReviewRow): Review {
  return {
    id: r.id,
    productId: r.productId,
    shopId: r.shopId,
    author: r.author,
    rating: r.rating,
    text: r.text,
    date: r.dateLabel,
  };
}

function toStory(r: StoryRow): Story {
  return {
    id: r.id,
    shopId: r.shopId,
    title: r.title,
    excerpt: r.excerpt,
    tone: r.tone,
    readTime: r.readTime,
    date: r.dateLabel,
  };
}

function toCategory(r: CategoryRow): Category {
  return {
    id: r.id,
    name: r.name,
    icon: r.icon as Category["icon"],
    desc: r.description,
  };
}

export async function getCategories(): Promise<Category[]> {
  const rows = await db.select().from(categories).orderBy(asc(categories.name));
  return rows.map(toCategory);
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await db.select().from(products).orderBy(asc(products.id));
  return rows.map(toProduct);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const [row] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return row ? toProduct(row) : undefined;
}

export async function getAllShops(): Promise<Shop[]> {
  const rows = await db.select().from(shops).orderBy(asc(shops.id));
  return rows.map(toShop);
}

// Spisak gradova (za filter u katalogu).
export async function getShopCities(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ city: shops.city })
    .from(shops)
    .orderBy(asc(shops.city));
  return rows.map((r) => r.city).filter(Boolean);
}

// Mapa shopId → naziv radnje (za kartice proizvoda/priča, bez N+1 upita).
export async function getShopNameMap(): Promise<Map<string, string>> {
  const rows = await db.select({ id: shops.id, name: shops.name }).from(shops);
  return new Map(rows.map((r) => [r.id, r.name]));
}

export async function getShopById(id: string): Promise<Shop | undefined> {
  const [row] = await db.select().from(shops).where(eq(shops.id, id)).limit(1);
  return row ? toShop(row) : undefined;
}

export async function getShopProducts(shopId: string): Promise<Product[]> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.shopId, shopId));
  return rows.map(toProduct);
}

export async function getAllReviews(): Promise<Review[]> {
  const rows = await db.select().from(reviews).orderBy(asc(reviews.id));
  return rows.map(toReview);
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const rows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId));
  return rows.map(toReview);
}

export async function getShopReviews(shopId: string): Promise<Review[]> {
  const rows = await db.select().from(reviews).where(eq(reviews.shopId, shopId));
  return rows.map(toReview);
}

export async function getAllStories(): Promise<Story[]> {
  const rows = await db.select().from(stories).orderBy(asc(stories.id));
  return rows.map(toStory);
}

export async function getStoryById(id: string): Promise<Story | undefined> {
  const [row] = await db
    .select()
    .from(stories)
    .where(eq(stories.id, id))
    .limit(1);
  return row ? toStory(row) : undefined;
}

export type CatalogResult = {
  items: Product[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

// Katalog: filter (cat), pretraga (q), sortiranje (sort) i paginacija (page).
export async function searchProducts(opts: {
  cat?: string;
  q?: string;
  sort?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  perPage?: number;
}): Promise<CatalogResult> {
  const perPage = opts.perPage ?? 12;

  const conds = [];
  if (opts.cat) conds.push(eq(products.category, opts.cat));
  if (opts.city) conds.push(eq(shops.city, opts.city));
  if (opts.minPrice != null) conds.push(gte(products.price, opts.minPrice));
  if (opts.maxPrice != null) conds.push(lte(products.price, opts.maxPrice));
  if (opts.q) {
    const like = `%${opts.q}%`;
    conds.push(
      or(
        ilike(products.name, like),
        ilike(products.description, like),
        ilike(shops.name, like),
      ),
    );
  }
  const where = conds.length ? and(...conds) : undefined;

  const orderBy =
    opts.sort === "cena-rastuce"
      ? asc(products.price)
      : opts.sort === "cena-opadajuce"
        ? desc(products.price)
        : opts.sort === "ocena"
          ? desc(products.rating)
          : desc(products.createdAt);

  const [countRow] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(products)
    .innerJoin(shops, eq(products.shopId, shops.id))
    .where(where);
  const total = Number(countRow?.c ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(1, opts.page ?? 1), totalPages);

  const rows = await db
    .select({ p: products })
    .from(products)
    .innerJoin(shops, eq(products.shopId, shops.id))
    .where(where)
    .orderBy(orderBy)
    .limit(perPage)
    .offset((page - 1) * perPage);

  return { items: rows.map((r) => toProduct(r.p)), total, page, perPage, totalPages };
}
