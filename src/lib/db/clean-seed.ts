import { isNull } from "drizzle-orm";
import { loadEnvLocal } from "../load-env";

// Briše SAMO seed radnje (one bez vlasnika — owner_id IS NULL) i, kaskadno,
// njihove proizvode, recenzije, priče, pratnje i razgovore. Prave radnje
// (koje su prodavci napravili kroz nalog) imaju owner_id i NE diraju se.
// Kategorije ostaju (to je taksonomija, ne seed sadržaj).
//
// Probni prikaz (ništa se ne briše):  npm run db:clean-seed
// Stvarno brisanje:                    npm run db:clean-seed -- --yes
async function main() {
  loadEnvLocal();
  const confirmed = process.argv.includes("--yes");
  const { db, schema } = await import("./index");

  const seedShops = await db
    .select({ id: schema.shops.id, name: schema.shops.name })
    .from(schema.shops)
    .where(isNull(schema.shops.ownerId));

  if (seedShops.length === 0) {
    console.log("Nema seed radnji (owner_id IS NULL). Ništa za brisanje.");
    process.exit(0);
  }

  console.log(`Seed radnje bez vlasnika — ${seedShops.length}:`);
  for (const s of seedShops) console.log("  - " + s.name);

  if (!confirmed) {
    console.log(
      "\nOvo je samo probni prikaz. Za stvarno brisanje pokreni:\n  npm run db:clean-seed -- --yes",
    );
    process.exit(0);
  }

  const deleted = await db
    .delete(schema.shops)
    .where(isNull(schema.shops.ownerId))
    .returning({ id: schema.shops.id });

  console.log(
    `\n✓ Obrisano ${deleted.length} seed radnji (+ njihovi proizvodi, recenzije, priče, pratnje i razgovori).`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error("Čišćenje nije uspelo:", err);
  process.exit(1);
});
