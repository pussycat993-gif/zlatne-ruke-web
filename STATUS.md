# Zlatne Ruke — status v1 i šta fali za produkciju

_Ažurirano: jun 2026._

## 1. Šta v1 ima

### Kupac (kupac)
- Pregled kataloga, filter po kategoriji (`?cat=`) i pretraga (`?q=`)
- Stranica proizvoda (galerija, opis, recenzije, povezani proizvodi)
- Stranica radnje (proizvodi, o radnji, recenzije) + lista svih radnji
- Magazin (priče) + „Saveti" (MDX blog sa SEO/FAQ)
- Omiljeno (srce) i praćenje radnji — čuva se u bazi
- Poruke majstorici (razgovori) sa oznakom nepročitanog
- Profil sa prečicama

### Prodavac (prodavac)
- Otvaranje radnje (automatski pri „Postani prodavac")
- Panel: pregled, proizvodi, dodavanje/izmena/brisanje proizvoda, statistika, profil radnje
- Upload slika proizvoda i naslovne radnje (Cloudinary)
- Poruke od kupaca + brojač nepročitanih

### Admin
- Panel: pregled platforme, radnje, proizvodi, recenzije (moderacija), kupci
- Auto-admin za `ADMIN_EMAIL`

### Tehnički
- Next.js 16 (App Router), TypeScript, Tailwind v4, shadcn/ui
- Auth: Clerk (email+lozinka, Google, magic link) + uloge (kupac/prodavac/admin)
- Baza: Supabase/Postgres + Drizzle ORM (migracije u `drizzle/`)
- Slike: Cloudinary (potpisani server upload)
- Dizajn „Femine Edition", custom SVG ikonice, dark/light tema
- SEO: per-stranica metadata, sitemap, JSON-LD (na Savetima)
- v1 opseg ispoštovan: bez korpe/checkout-a/online plaćanja

---

## 2. Šta fali za produkciju

### A. Blokeri (mora pre lansiranja)
- [ ] **Clerk produkcijski ključevi** — sada su test (`pk_test`/`sk_test`). Napraviti production instancu + povezati domen.
- [ ] **Cloudinary `API_KEY`/`API_SECRET`** u env-u (bez njih upload slika ne radi).
- [ ] **Rotirati DB lozinku** (jednom se videla u logu tokom razvoja).
- [ ] **Supabase plan** — free tier „uspavljuje" projekat; za produkciju paid plan ili svesno prihvatiti pauziranje.
- [ ] **Env varijable na Vercel-u** — sve iz `.env.example` (Clerk, DB `DATABASE_URL`+`DIRECT_URL`, Cloudinary, `ADMIN_EMAIL`, `NEXT_PUBLIC_SITE_URL`).
- [ ] **`NEXT_PUBLIC_SITE_URL`** na pravi domen (canonical, OpenGraph, sitemap).

### B. Bezbednost / robustnost
- [ ] Rate limiting na slanje poruka i forme (anti-spam).
- [ ] Validacija upload-a (tip/veličina slike) i eventualno moderacija sadržaja.
- [ ] `robots.txt` + provera da admin/panel rute nisu indeksirane.
- [ ] Custom `not-found.tsx` i `error.tsx` stranice (lepša greška).

### C. Sadržaj i pravno
- [ ] Pravni tekstovi (Uslovi, Privatnost) su **nacrt** — proveriti sa pravnikom.
- [ ] Pravi tekstovi „O nama", „Kontakt", popuniti Saveti (sad 1 članak).
- [ ] Zameniti seed podatke (radnje/proizvodi) pravim, ili ih očistiti.

### D. Funkcionalne nadogradnje (posle MVP-a)
- [ ] Više slika po proizvodu (sad jedna) + galerija.
- [ ] Paginacija/„učitaj još" na katalogu (sad sve odjednom).
- [ ] Bolja pretraga (sad jednostavan `ILIKE`).
- [ ] Email notifikacije za nove poruke; opciono realtime poruke (Supabase Realtime).
- [ ] JSON-LD za proizvode/radnje (rich results), ne samo Saveti.
- [ ] ISR/`revalidate` za statične liste (naslovna je dinamička; `/radnje`, `/magazin` se osvežavaju na rebuild).

### E. Kvalitet
- [ ] Testovi (trenutno ih nema).
- [ ] Analitika (npr. Vercel Analytics / Plausible).
- [ ] Provera pristupačnosti (a11y) i Lighthouse.

---

## 3. Brzi podsetnik za deploy (Vercel)
1. Poveži GitHub repo na Vercel.
2. Dodaj sve env varijable (vidi `.env.example`).
3. Build komanda je default (`next build`). Migracije baze pokrenuti ručno: `npm run db:migrate` (lokalno, ka produkcijskoj bazi) pre prvog deploy-a.
4. Podesi Clerk production domen i Cloudinary kredencijale.
