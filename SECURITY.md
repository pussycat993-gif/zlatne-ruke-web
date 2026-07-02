# Bezbednosni model — Zlatne Ruke

Kratak opis kako je obezbeđen pristup podacima. (v1)

## Arhitektura pristupa bazi
- Sav pristup bazi ide **server-side, preko Drizzle ORM** (`src/lib/db/index.ts`),
  koristeći Postgres connection string (`DATABASE_URL`, Supabase pooler).
- Rola konekcije je **`postgres`** — ima `rolbypassrls=true` i vlasnik je tabela,
  pa **zaobilazi RLS**. To je namerno: RLS je „defense-in-depth", a prava
  autorizacija je u aplikacionom sloju.
- **Ne koristi se `@supabase/supabase-js` ni anon ključ.** Browser nikada ne
  priča direktno sa bazom. Auth je **Clerk** (ne Supabase Auth).

## Row Level Security (RLS)
- Migracija **`drizzle/0010_enable_rls.sql`**: `ENABLE ROW LEVEL SECURITY` na
  **svim** public tabelama (bez politika = deny-by-default) + `REVOKE ALL` za
  role `anon` i `authenticated`, plus opoziv default privilegija.
- Efekat: **Supabase PostgREST / anon ključ ne može da čita ni piše ništa.**
  App putanja (rola `postgres`) nastavlja da radi jer zaobilazi RLS.

## Zašto NEMA per-uloga RLS politika sa Clerk JWT
- Postgres nikada ne vidi Clerk JWT (app se konektuje kao `postgres`), pa
  politike tipa `owner = auth.jwt()->>'sub'` **ne bi imale efekta** na app
  putanji, a anon/PostgREST je već potpuno zaključan. Bile bi mrtav kod.
- Prava per-seller izolacija kroz bazu zahtevala bi re-arhitekturu (Clerk JWT
  template + Supabase third-party auth + čitanje preko `supabase-js` sa
  korisnikovim tokenom). Van opsega v1; ne donosi korist koju app sloj već daje.

## Aplikaciona autorizacija (pravi „gate")
Server akcije (`src/lib/*-actions.ts`) proveravaju identitet i vlasništvo:
- Clerk `auth()` / `currentUser()` za identitet; neulogovani se odbijaju/redirektuju.
- Vlasništvo: npr. izmena/brisanje proizvoda proverava
  `product.shopId === sellerShop.id`; poruke proveravaju učesnika razgovora;
  omiljeno/praćenje/recenzije/obaveštenja su vezani za `userId`.
- Uloge: `requireRole(["admin"])` / `requireRole(["prodavac","admin"])` u panel
  layout-ima i admin akcijama. Admin se određuje preko `ADMIN_EMAIL` ili
  `publicMetadata.role === "admin"` (vidi `src/lib/auth.ts`).
- Middleware (`src/proxy.ts`) dodatno zahteva „signed-in" za `/admin`, `/prodavac`,
  `/profil`.

## Preostali bezbednosni TODO (pre lansiranja)
1. **Rotirati tajne** koje su bile izložene: DB lozinka (Supabase) + Clerk secret.
2. **Clerk Production instanca** (trenutno test ključevi).
3. Rate-limit/captcha na kontakt formi.
