import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL nije postavljen. Dodaj Supabase connection string u .env.local.",
  );
}

// `prepare: false` je preporuka za Supabase pooler (PgBouncer, transaction mode).
// `idle_timeout` zatvara uspavane konekcije (sprečava „zastarele" konekcije
// posle migracija/pauza), pa se otvara sveža po potrebi.
const client = postgres(connectionString, {
  prepare: false,
  idle_timeout: 20,
});

export const db = drizzle(client, { schema });
export { schema };
