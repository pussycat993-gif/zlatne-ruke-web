// Test-korisnici (na DEV Clerk instanci) i putanje sačuvanih sesija.
// Kredencijali dolaze iz .env.test — NEMA tajni u kodu.
export type RoleKey = "buyer" | "sellerA" | "sellerB" | "admin";

export const ROLES: Record<
  RoleKey,
  { email: string; password: string; storage: string }
> = {
  buyer: {
    email: process.env.E2E_BUYER_EMAIL ?? "",
    password: process.env.E2E_BUYER_PASSWORD ?? "",
    storage: "e2e/.auth/buyer.json",
  },
  sellerA: {
    email: process.env.E2E_SELLER_A_EMAIL ?? "",
    password: process.env.E2E_SELLER_A_PASSWORD ?? "",
    storage: "e2e/.auth/sellerA.json",
  },
  sellerB: {
    email: process.env.E2E_SELLER_B_EMAIL ?? "",
    password: process.env.E2E_SELLER_B_PASSWORD ?? "",
    storage: "e2e/.auth/sellerB.json",
  },
  admin: {
    email: process.env.E2E_ADMIN_EMAIL ?? "",
    password: process.env.E2E_ADMIN_PASSWORD ?? "",
    storage: "e2e/.auth/admin.json",
  },
};
