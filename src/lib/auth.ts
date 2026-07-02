import "server-only";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isCurrentUserAdmin } from "./is-admin";

export type Role = "kupac" | "prodavac" | "admin";

// OSNOVNA uloga ulogovanog korisnika iz Clerk publicMetadata.role.
// - vraća samo "kupac" ili "prodavac" (podrazumevano "kupac")
// - admin NIJE ovde: admin je odvojen i određuje se ISKLJUČIVO po email-u
//   (vidi is-admin.ts). Zato „Otvori radnju" (role = "prodavac") ne dira admin.
export async function getCurrentRole(): Promise<Role | null> {
  const user = await currentUser();
  if (!user) return null;

  const role = user.publicMetadata?.role as Role | undefined;
  return role === "prodavac" ? "prodavac" : "kupac";
}

// Zahteva jednu od dozvoljenih uloga; u suprotnom preusmerava.
// (Prijavu već obezbeđuje proxy.ts; ovde proveravamo autorizaciju.)
// „admin" u listi dozvoljenih ispunjava se EMAIL-om (ne ulogom), pa admin
// prolazi bez obzira na to koja mu je osnovna uloga (kupac/prodavac).
export async function requireRole(
  allowed: Role[],
  fallback = "/",
): Promise<Role> {
  if (allowed.includes("admin") && (await isCurrentUserAdmin())) return "admin";

  const role = await getCurrentRole();
  if (!role) redirect("/login");
  if (!allowed.includes(role)) redirect(fallback);
  return role;
}
