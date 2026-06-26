import { loadEnvLocal } from "../load-env";
import {
  categories as seedCategories,
  shops as seedShops,
  products as seedProducts,
  reviews as seedReviews,
  stories as seedStories,
} from "../data";

// Puni bazu početnim podacima. Idempotentno (onConflictDoNothing po id-u).
// Pokretanje: npm run db:seed  (zahteva DATABASE_URL u .env.local)
async function main() {
  loadEnvLocal();

  // Dinamički import da se DATABASE_URL učita PRE nego što se napravi konekcija.
  const { db, schema } = await import("./index");

  console.log("Ubacujem kategorije…");
  await db
    .insert(schema.categories)
    .values(
      seedCategories.map((c) => ({
        id: c.id,
        name: c.name,
        icon: c.icon,
        description: c.desc,
      })),
    )
    .onConflictDoNothing();

  console.log("Ubacujem radnje…");
  await db
    .insert(schema.shops)
    .values(
      seedShops.map((s) => ({
        id: s.id,
        name: s.name,
        owner: s.owner,
        city: s.city,
        rating: s.rating,
        reviews: s.reviews,
        followers: s.followers,
        category: s.category,
        tone: s.tone,
        bio: s.bio,
      })),
    )
    .onConflictDoNothing();

  console.log("Ubacujem proizvode…");
  await db
    .insert(schema.products)
    .values(
      seedProducts.map((p) => ({
        id: p.id,
        shopId: p.shopId,
        name: p.name,
        price: p.price,
        oldPrice: p.oldPrice ?? null,
        category: p.category,
        tone: p.tone,
        rating: p.rating,
        reviewCount: p.reviewCount,
        inStock: p.inStock,
        description: p.desc,
      })),
    )
    .onConflictDoNothing();

  console.log("Ubacujem recenzije…");
  await db
    .insert(schema.reviews)
    .values(
      seedReviews.map((r) => ({
        id: r.id,
        productId: r.productId,
        shopId: r.shopId,
        author: r.author,
        rating: r.rating,
        text: r.text,
        dateLabel: r.date,
      })),
    )
    .onConflictDoNothing();

  console.log("Ubacujem priče…");
  await db
    .insert(schema.stories)
    .values(
      seedStories.map((s) => ({
        id: s.id,
        shopId: s.shopId,
        title: s.title,
        excerpt: s.excerpt,
        tone: s.tone,
        readTime: s.readTime,
        dateLabel: s.date,
      })),
    )
    .onConflictDoNothing();

  console.log("✓ Seed gotov.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed nije uspeo:", err);
  process.exit(1);
});
