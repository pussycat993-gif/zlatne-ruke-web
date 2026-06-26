import { defineConfig } from "drizzle-kit";
import { loadEnvLocal } from "./src/lib/load-env";

loadEnvLocal();

// Migracije/seed idu preko DIRECT_URL (Session pooler / direct, port 5432) jer
// transaction pooler (6543) ne podržava DDL/advisory lock-ove. Aplikacija u
// runtime-u koristi DATABASE_URL (pooler 6543).
const migrationUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: migrationUrl!,
  },
});
