import { currentUser } from "@clerk/nextjs/server";

// ─────────────────────────────────────────────────────────────────────────
// Admin je ODVOJEN od uloge kupac/prodavac.
//
// Određuje se ISKLJUČIVO po tome da li je email ulogovanog korisnika u listi
// ADMIN_EMAILS (zarezom razdvojena lista mejlova). Admin se NE čuva u
// publicMetadata.role — pa akcija „Otvori radnju" (koja postavlja role =
// "prodavac") NE MOŽE da pregazi admin status. Korisnik može biti i admin i
// prodavac istovremeno.
//
// Env: primarno ADMIN_EMAILS (množina, lista). Radi nazad-kompatibilnosti
// čitamo i stari ADMIN_EMAIL (jednina) — dok se ne doda ADMIN_EMAILS na Vercel.
// (Napomena: ADMIN_EMAIL i dalje koristi email.ts kao primaoca kontakt-forme.)
// ─────────────────────────────────────────────────────────────────────────

function adminEmailSet(): Set<string> {
  const raw = `${process.env.ADMIN_EMAILS ?? ""},${process.env.ADMIN_EMAIL ?? ""}`;
  return new Set(
    raw
      .split(/[,;\s]+/)
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

/** Da li je dati email admin? Čista funkcija — koristi je i proxy (middleware). */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return adminEmailSet().has(email.toLowerCase());
}

/** Da li je TRENUTNO ulogovani korisnik admin? (server-side, po email-u) */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await currentUser();
  return isAdminEmail(user?.primaryEmailAddress?.emailAddress);
}
