# Zlatne Ruke — status i šta fali za produkciju

_Ažurirano: jun 2026. — **UŽIVO:** https://zlatne-ruke-web.vercel.app_

## 1. Šta je gotovo

### Kupac (kupac)
- Katalog sa filterom po kategoriji, pretragom, **sortiranjem i paginacijom**
- Stranica proizvoda (galerija **više slika**, opis, recenzije, povezani proizvodi)
- Stranica radnje (proizvodi, o radnji, recenzije) + lista svih radnji
- Magazin (priče) + „Saveti" (MDX blog sa SEO/FAQ)
- Omiljeno (srce) i praćenje radnji — u bazi
- **Pisanje recenzija** (ocena + komentar; preračun prosečne ocene)
- Poruke majstorici (razgovori) sa oznakom nepročitanog
- Profil sa prečicama

### Prodavac (prodavac)
- Otvaranje radnje (automatski pri „Postani prodavac"), radnja vezana za nalog
- Panel: pregled, proizvodi, **dodavanje/izmena/brisanje** proizvoda, statistika, profil radnje
- **Upload više slika** proizvoda i naslovne radnje (Cloudinary, radi uživo)
- Poruke od kupaca + brojač nepročitanih

### Admin
- Panel: pregled, radnje, proizvodi, recenzije (moderacija), kupci
- Auto-admin za `ADMIN_EMAIL`

### Tehnički / SEO / produkcija
- Next.js 16 (App Router), TypeScript, Tailwind v4, shadcn/ui
- Auth: Clerk + uloge (kupac/prodavac/admin), zaštita ruta (proxy)
- Baza: Supabase/Postgres + Drizzle ORM (migracije u `drizzle/`)
- Slike: Cloudinary (potpisani server upload)
- **Deploy na Vercel** (auto-deploy na `git push`)
- SEO: per-stranica metadata, `metadataBase`, OpenGraph, **sitemap.xml**,
  **robots.txt**, **JSON-LD** (proizvodi=Product, radnje=Store, Saveti=Article+FAQ)
- **Custom 404 i error/​global-error strane**
- Privatne rute (`/admin`, `/prodavac`, `/profil`, auth) — `noindex` + robots disallow
- v1 opseg ispoštovan: bez korpe/checkout-a/online plaćanja

---

## 2. Šta još fali

### A. Operativno pre „pravog" lansiranja
- [ ] **Clerk Production** instanca + povezivanje pravog domena (sada test ključevi)
- [ ] **Rotirati DB lozinku** (jednom se videla u logu tokom razvoja)
- [ ] **Supabase plan** — free tier „uspavljuje" projekat (za stalnu dostupnost paid)
- [ ] **Svoj domen** (umesto `*.vercel.app`) + podesiti `NEXT_PUBLIC_SITE_URL` na njega

### B. Sadržaj i pravno
- [ ] Pravni tekstovi (Uslovi, Privatnost) su **nacrt** — proveriti sa pravnikom
- [ ] Pravi tekstovi „O nama"/„Kontakt", još Saveta članaka
- [ ] Zameniti seed podatke (radnje/proizvodi) pravim ili ih očistiti

### C. Funkcionalne nadogradnje
- [ ] **Email obaveštenja** za nove poruke (npr. Resend) — traži API ključ
- [ ] Realtime poruke (Supabase Realtime) — sada se osvežava na akciju
- [ ] Bolja pretraga (sada `ILIKE`)

### D. Bezbednost / kvalitet
- [ ] Rate limiting na forme i poruke (anti-spam)
- [ ] Testovi, analitika (Vercel Analytics/Plausible), a11y/Lighthouse provera

---

## 3. Env varijable (Vercel + lokalno `.env.local`)
Vidi `.env.example`. Ključne:
`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`,
Clerk sign-in/up URL-ovi, `ADMIN_EMAIL`,
`DATABASE_URL` (pooler 6543), `DIRECT_URL` (pooler 5432),
`CLOUDINARY_CLOUD_NAME`/`API_KEY`/`API_SECRET`, `NEXT_PUBLIC_SITE_URL`.

## 4. Korisne komande
- `npm run dev` — lokalni razvoj
- `npm run db:generate` / `db:migrate` / `db:seed` — baza (Drizzle)
- Deploy: `git push origin main` → Vercel automatski objavljuje

## 5. Čišćenje seed (demo) podataka pre lansiranja
Početne (izmišljene) radnje nemaju vlasnika (`owner_id` je prazan), pa se lako
uklanjaju, dok prave radnje koje su prodavci napravili kroz nalog ostaju.

1. **Probni prikaz** (ništa se ne briše, samo lista šta bi se obrisalo):
   ```
   npm run db:clean-seed
   ```
2. **Stvarno brisanje** (briše seed radnje + njihove proizvode, recenzije,
   priče, pratnje i razgovore — kaskadno):
   ```
   npm run db:clean-seed -- --yes
   ```

Napomene:
- Radi nad bazom iz `.env.local` (`DIRECT_URL`/`DATABASE_URL`) — to je ista
  Supabase baza koju koristi i produkcija, pa promene odmah važe i uživo.
- **Kategorije se NE brišu** (to je taksonomija koju koriste pravi proizvodi).
- Ako kasnije opet pokreneš `npm run db:seed`, vraćaju se demo podaci.
