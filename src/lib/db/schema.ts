import {
  pgTable,
  pgEnum,
  text,
  integer,
  real,
  boolean,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Topovi za „blob" placeholder slike (dok ne uvedemo Cloudinary).
export const toneEnum = pgEnum("tone", ["v2", "v3", "v4", "v5"]);

export const categories = pgTable("categories", {
  id: text("id").primaryKey(), // npr. "tekstil"
  name: text("name").notNull(),
  icon: text("icon").notNull(), // IconName iz components/icon
  description: text("description").notNull().default(""),
});

export const shops = pgTable(
  "shops",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    ownerId: text("owner_id"), // Clerk user id (null za seed radnje)
    name: text("name").notNull(),
    owner: text("owner").notNull(), // ime vlasnice (prikaz)
    city: text("city").notNull(),
    rating: real("rating").notNull().default(0),
    reviews: integer("reviews").notNull().default(0),
    followers: integer("followers").notNull().default(0),
    category: text("category")
      .notNull()
      .references(() => categories.id),
    tone: toneEnum("tone").notNull().default("v2"),
    bio: text("bio").notNull().default(""),
    views: integer("views").notNull().default(0), // pregledi profila radnje
    coverPublicId: text("cover_public_id"), // Cloudinary public id naslovne slike
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  // Jedan nalog = jedna radnja. (NULL owner_id za seed radnje je dozvoljen
  // više puta - Postgres tretira NULL-ove kao različite u unique indeksu.)
  (t) => [uniqueIndex("shops_owner_uq").on(t.ownerId)],
);

export const products = pgTable("products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  shopId: text("shop_id")
    .notNull()
    .references(() => shops.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: integer("price").notNull(), // RSD
  oldPrice: integer("old_price"),
  category: text("category")
    .notNull()
    .references(() => categories.id),
  tone: toneEnum("tone").notNull().default("v2"),
  rating: real("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  inStock: integer("in_stock").notNull().default(0),
  description: text("description").notNull().default(""),
  views: integer("views").notNull().default(0), // pregledi stranice proizvoda
  imagePublicId: text("image_public_id"), // naslovna (prva) slika - za kartice
  imagePublicIds: text("image_public_ids").array().notNull().default([]), // galerija
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const reviews = pgTable(
  "reviews",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    shopId: text("shop_id")
      .notNull()
      .references(() => shops.id, { onDelete: "cascade" }),
    authorId: text("author_id"), // Clerk user id (null za seed)
    author: text("author").notNull(),
    rating: integer("rating").notNull(),
    text: text("text").notNull(),
    dateLabel: text("date_label").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  // Jedna recenzija po korisniku po proizvodu (NULL authorId za seed je ok).
  (t) => [uniqueIndex("reviews_author_product_uq").on(t.authorId, t.productId)],
);

export const stories = pgTable("stories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  shopId: text("shop_id")
    .notNull()
    .references(() => shops.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  tone: toneEnum("tone").notNull().default("v2"),
  readTime: text("read_time").notNull().default(""),
  dateLabel: text("date_label").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Omiljeni proizvodi po korisniku (Clerk user id).
export const favorites = pgTable(
  "favorites",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("favorites_user_product_uq").on(t.userId, t.productId)],
);

// Razgovor između kupca (Clerk userId) i radnje. Jedan thread po paru.
export const conversations = pgTable(
  "conversations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    buyerId: text("buyer_id").notNull(),
    buyerName: text("buyer_name").notNull().default(""), // snapshot imena kupca
    shopId: text("shop_id")
      .notNull()
      .references(() => shops.id, { onDelete: "cascade" }),
    lastSenderId: text("last_sender_id"), // ko je poslao poslednju poruku
    buyerLastReadAt: timestamp("buyer_last_read_at", { withTimezone: true }),
    sellerLastReadAt: timestamp("seller_last_read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("conversations_buyer_shop_uq").on(t.buyerId, t.shopId)],
);

// Obaveštenja po korisniku (pratilac, recenzija, poruka…).
export const notifications = pgTable("notifications", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(), // primalac (Clerk userId)
  type: text("type").notNull(), // "follow" | "review" | "message"
  title: text("title").notNull(),
  body: text("body").notNull().default(""),
  href: text("href").notNull().default(""),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const messages = pgTable("messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  senderId: text("sender_id").notNull(), // Clerk userId pošiljaoca
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Korisnički predloženi tagovi koji čekaju moderaciju admina.
// status: pending (čeka) → approved (odobren) | rejected (odbijen).
export const tagStatusEnum = pgEnum("tag_status", [
  "pending",
  "approved",
  "rejected",
]);

export const tags = pgTable("tags", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  groupLabel: text("group_label").notNull().default(""), // npr. "Stil", "Tradicija"
  proposedByShopId: text("proposed_by_shop_id").references(() => shops.id, {
    onDelete: "set null",
  }),
  proposedByName: text("proposed_by_name").notNull().default(""), // snapshot imena predlagača
  status: tagStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Prijave na obaveštenje o lansiranju („coming soon" forma na /uskoro).
// Piše se ISKLJUČIVO sa servera (app/api/newsletter/route.ts) — browser nikad
// ne dira ovu tabelu direktno. Kada se uključi RLS na Supabase-u, ne treba
// nijedna anon read/insert politika (app se konektuje kao rola postgres koja
// bypassuje RLS; anon/authenticated nemaju grantove — vidi 0010_enable_rls).
export const newsletterSignups = pgTable("newsletter_signups", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Praćene radnje po korisniku.
export const follows = pgTable(
  "follows",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull(),
    shopId: text("shop_id")
      .notNull()
      .references(() => shops.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("follows_user_shop_uq").on(t.userId, t.shopId)],
);
