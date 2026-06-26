import "server-only";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type Role = "kupac" | "prodavac" | "admin";

// Efektivna uloga ulogovanog korisnika:
// - email iz ADMIN_EMAIL => uvek "admin" (bez ručnog podešavanja u Clerk-u)
// - inače publicMetadata.role, podrazumevano "kupac"
export async function getCurrentRole(): Promise<Role | null> {
  const user = await currentUser();
  if (!user) return null;

  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  if (email && adminEmail && email === adminEmail) return "admin";

  const role = user.publicMetadata?.role as Role | undefined;
  return role ?? "kupac";
}

// Zahteva jednu od dozvoljenih uloga; u suprotnom preusmerava.
// (Prijavu već obezbeđuje proxy.ts; ovde proveravamo autorizaciju.)
export async function requireRole(
  allowed: Role[],
  fallback = "/",
): Promise<Role> {
  const role = await getCurrentRole();
  if (!role) redirect("/login");
  if (!allowed.includes(role)) redirect(fallback);
  return role;
}
