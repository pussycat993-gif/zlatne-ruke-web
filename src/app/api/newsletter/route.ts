import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { newsletterSignups } from "@/lib/db/schema";

// Server-only ruta za prijavu na obaveštenje o lansiranju (forma na /uskoro).
// postgres-js/Drizzle traži Node runtime (ne edge).
export const runtime = "nodejs";
// Nikad ne keširaj — ovo je mutacija.
export const dynamic = "force-dynamic";

// Jednostavna, ali stroga validacija email formata.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, status: "invalid" },
      { status: 400 },
    );
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  // Honeypot: skriveno polje koje ljudi ne popunjavaju. Ako je popunjeno →
  // verovatno bot. Tiho vrati „uspeh" (bez upisa), da bot ne nauči šablon.
  const honeypot = typeof body.company === "string" ? body.company.trim() : "";

  if (honeypot) {
    return NextResponse.json({ ok: true, status: "subscribed" });
  }

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, status: "invalid" },
      { status: 400 },
    );
  }

  try {
    // onConflictDoNothing + returning: ako email već postoji, ništa se ne upisuje
    // i vrati se prazan niz → tretiramo kao „već prijavljen" (bez 500, bez
    // otkrivanja tuđih podataka). Vraćamo SAMO status, nikad email(ove).
    const inserted = await db
      .insert(newsletterSignups)
      .values({ email })
      .onConflictDoNothing({ target: newsletterSignups.email })
      .returning({ id: newsletterSignups.id });

    if (inserted.length === 0) {
      return NextResponse.json({ ok: true, status: "duplicate" });
    }
    return NextResponse.json({ ok: true, status: "subscribed" });
  } catch {
    return NextResponse.json(
      { ok: false, status: "error" },
      { status: 500 },
    );
  }
}
