import { defineConfig, devices } from "@playwright/test";

// Učitaj TEST okruženje (zasebna Supabase baza!) — NIKAD produkcija.
// Node 20.6+ ima process.loadEnvFile; ako .env.test ne postoji, testovi se
// neće ispravno pokrenuti (namerno — da ne udare u prod).
try {
  process.loadEnvFile(".env.test");
} catch {
  console.warn("⚠ .env.test nije pronađen — napravi ga pre pokretanja e2e testova.");
}

const PORT = 3000;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  // Redosled nije bitan; svaki test je nezavisan. Serijski da ne trošimo Clerk rate-limit.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "html",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: "on-first-retry",
    testIdAttribute: "data-testid",
  },
  projects: [
    // 1) Prijavi sve test-uloge i sačuvaj njihove sesije (storageState).
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    // 2) Testovi (zavise od setup-a).
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
  ],
  // Diže dev server sa TEST env-om. webServer.env ima prednost nad .env.local
  // (Next/@next/env ne prepisuje već postavljene process.env vrednosti).
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      DATABASE_URL: process.env.DATABASE_URL ?? "",
      DIRECT_URL: process.env.DIRECT_URL ?? "",
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "",
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? "",
      ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? "",
      NEXT_PUBLIC_CLERK_SIGN_IN_URL: "/login",
      NEXT_PUBLIC_CLERK_SIGN_UP_URL: "/register",
    },
  },
});
