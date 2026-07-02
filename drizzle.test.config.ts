import { defineConfig } from "drizzle-kit";

// Config SAMO za test bazu. NE učitava .env.local (da nikad ne dodirne prod).
// URL se prosleđuje inline preko TEST_DATABASE_URL.
// Koristi se sa `drizzle-kit push` (kreira tabele iz šeme, bez RLS migracije
// koja zavisi od Supabase anon/authenticated rola).
const url = process.env.TEST_DATABASE_URL;
if (!url) throw new Error("Postavi TEST_DATABASE_URL (lokalna/test baza).");

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
});
