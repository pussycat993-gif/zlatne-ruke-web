@AGENTS.md

# Zlatne Ruke — projektni kontekst za Claude Code

> **Napomena za sebe:** AGENTS.md gore važi uvek — ovo NIJE Next.js iz tvog
> treninga. Pre pisanja koda pročitaj relevantni vodič u
> `node_modules/next/dist/docs/`. (Vidi i odeljak "Stvarni stack" dole —
> instalirana verzija je Next **16**, ne 14.)

---

## 1. Šta je projekat

**Zlatne Ruke** — katalog / oglasna platforma koja povezuje **žene
zanatlije iz Srbije** sa kupcima. Svaki predmet ima ime, mesto i priču.

- **Slogan:** „Kad žena stvara srcem, nastaje magija."
- **Drugi tagline iz prototipa:** „Svaki predmet ima ime, mesto i priču."
- **Jezik:** srpski (UI tekst, URL-ovi, sadržaj). `lang="sr"`.

### Uloge
- **kupac** (buyer) — pretražuje katalog, čuva omiljeno, prati radnje, šalje
  upit/poruku prodavcu.
- **prodavac** (seller) — otvara radnju, dodaje proizvode, video, profil.
- **admin** — moderacija radnji/proizvoda/recenzija, pregled platforme.

### ⚠️ OPSEG v1 — KATALOG / OGLAŠAVANJE SAMO
- **NEMA plaćanja, NEMA korpe/checkout-a, NEMA platne infrastrukture.**
- Prodavci rešavaju **plaćanje i dostavu van platforme** (offline).
- Umesto „Dodaj u korpu" / „Plaćanje" → akcija je **kontakt sa prodavcem**
  (npr. „Pošalji upit / poruku majstorici").
- **Prototip (design-reference) SADRŽI korpu, checkout, „Besplatnu dostavu",
  formatiranje cene, Admin → Plaćanja, provizije.** Sve to je VAN v1 opsega —
  kada portuješ stranice iz prototipa, **izbaci kupovinske tokove** i zameni
  ih kontaktom/oglasom. (Detaljnije u `design-reference/README-DESIGN (1).md`,
  odeljak „opseg v1 vs prototip".)

---

## 2. Stvarni stack (provereno iz repoa)

| Oblast | Tehnologija | Napomena |
|--------|-------------|----------|
| Framework | **Next.js `16.2.4`** (App Router) | Dogovor je bio „Next 14", ali instalirano je **16**. Tretiraj kao novi Next — čitaj `node_modules/next/dist/docs/`. |
| UI lib | **React `19.2.4`** | |
| Jezik | **TypeScript** (strict) | alias `@/*` → `./src/*` |
| Stilovi | **Tailwind CSS v4** | **Nema `tailwind.config.js`** — konfiguracija je u `src/app/globals.css` preko `@theme inline` + `@import "tailwindcss"`. PostCSS: `@tailwindcss/postcss`. |
| Komponente | **shadcn/ui** (`shadcn` v4, `radix-ui`) | `components.json`: style `radix-nova`, rsc=true. Baza u `src/components/ui/`. |
| Auth | **Clerk** (`@clerk/nextjs` v7) | Instalirano, **još nije konfigurisano** (nema middleware/providera). |
| Baza | **Supabase / Postgres** + **Drizzle ORM** | `drizzle-orm`, `drizzle-kit`, `postgres`. **Još nema šeme ni konekcije.** |
| Slike | **Cloudinary** (`next-cloudinary`) | Još nije konfigurisano. |
| Forme | `react-hook-form` + `zod` + `@hookform/resolvers` | |
| Ostalo | `sonner` (toast), `date-fns`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react` | |
| Deploy | **Vercel** | |

**Trenutno stanje koda (Faza 1 gotova):** podešeni su fontovi, design tokeni,
ikonice, `Button`, seed podaci. `src/app/page.tsx` je **još default Next
starter** (nije prava naslovna). Nema ruta, baze, auth-a, ni stranica.

### Postojeći fajlovi koji su važni
- `src/app/layout.tsx` — root layout, `lang="sr"`, fontovi preko `next/font`.
- `src/app/globals.css` — **izvor istine za tokene + Tailwind temu** (vidi #3).
- `src/components/icon.tsx` — **custom SVG `Icon` set** (vidi #4). `IconName` tip.
- `src/components/ui/button.tsx` — shadcn Button (varijante: default/outline/
  secondary/ghost/destructive/link; veličine uklj. `icon`).
- `src/lib/data.ts` — seed katalog (`categories`, `shops`, `products`,
  `stories`) + `getShop`, `formatPrice` (`sr-RS`, „RSD"), `toneClass`.
  Statično za v1 (bez backenda). **Već očišćeno od emoji-ja**, koristi `IconName`.
- `src/lib/utils.ts` — `cn()`.

---

## 3. Dizajn sistem — „Femine Edition"

Tokeni žive u `src/app/globals.css` (a referentni original u
`design-reference/DESIGN-TOKENS (1).css`). Boje se koriste **isključivo preko
tokena / Tailwind utility-ja**, nikad hardkodovane.

### Paleta — svetla tema (default, izvor istine)
| Uloga | Token | Boja |
|-------|-------|------|
| Primarna (roze) | `--zr-pink` | `#C0637A` |
| Tamno roze | `--zr-pink-dark` | `#A0445A` |
| Svetlo roze | `--zr-pink-light` | `#F5ECEE` |
| Roze tint | `--zr-pink-tint` | `#FBE7EC` |
| Krem (pozadina) | `--zr-cream` | `#FDF6F0` |
| Krem deep | `--zr-cream-deep` | `#F8EBDD` |
| Površina / kartice | `--zr-surface` | `#FFFFFF` |
| Tekst sivi | `--zr-gray` | `#7A6068` |
| Ivice | `--zr-border` | `#E8C8D0` |
| Hero pozadina | `--zr-hero-bg` | `#A0445A` |

### Paleta — tamna tema
U dark modu **roze tokeni nose ZLATNU ulogu** (topli brown-burgundy, **nikad
čisto crno**): primarna `#D4A155`, svetlo zlatna `#E8BB6D`, pozadina `#14100F`,
surface `#221B1C`. Hero text `#E8BB6D`.

> ⚠️ **Dark mode je `class`-based**: globals.css ima
> `@custom-variant dark (&:is(.dark *))`. Dark se uključuje klasom **`.dark`**
> na korenu — NE preko `data-theme="dark"` (to je radio samo HTML prototip).

### Tailwind utility mapiranja (iz `@theme inline`)
Tokeni su izloženi kao utility klase, npr:
`bg-cream`, `bg-surface`, `text-pink`, `text-pink-dark`, `text-ink`,
`border-line`, `bg-hero` / `text-hero-foreground`, plus standardni shadcn
semantički tokeni (`bg-primary`, `text-muted-foreground`, `bg-card`…).
Radijusi: `rounded-sm…rounded-4xl` (skalirani od `--radius`).

### Fontovi (uvek `latin-ext` subset!)
- **DM Sans** — telo + naslovi (`--font-sans` / `font-sans`, `font-heading`).
- **Caveat** — rukopisni akcenti / „script" (`font-script`).
- **JetBrains Mono** — mono labele / eyebrow (`font-mono`).

Učitani u `layout.tsx` preko `next/font/google` sa
`subsets: ["latin", "latin-ext"]`. (Prototip je negde pominjao Cormorant/
Dancing Script — to je **staro**, ne koristi se.)

---

## 4. UI pravila (obavezno)

- **Ikonice: uvek preko `<Icon name="..." />` (`src/components/icon.tsx`).**
  **NIKAD emoji u UI.** Od 2026-06-29 `Icon` interno koristi **lucide-react**
  (jedinstven stil), ali API ostaje isti (`name`, `size`, `filled`,
  `strokeWidth`). Imena su ključevi `MAP`-a u `icon.tsx` (home, search, bag,
  bell, user, heart, star, chat, plus, minus, back, forward, close, check,
  filter, grid, list, edit, trash, location, phone, share, camera, image,
  send, eye, chevron, chevronDown, sparkle, flower, package, truck, tag,
  paint, shield, chart, info, quote, refresh, sun, moon, menu, clock,
  calendar). Treba novo ime → dodaj lucide ikonicu u `MAP`.
- **Dugmad: pill-shaped** (jako zaobljena / `rounded-full` gde je akcenat).
- **Foto placeholderi: „organic blob" / zaobljeni**, topli gradijenti preko
  `toneClass` (v2–v5) iz `data.ts` — bez hardkodovanih boja, bez pravih slika
  za sada.
- **Kartice: rounded** (mekani radijusi, suptilna `--zr-shadow*` senka).
- **Mobile-first, responsive.** (Prototip je desktop-fokusiran sa fiksnim
  px vrednostima — kad portuješ, prevedi na responsive Tailwind.)

---

## 5. Rute / URL-ovi (na srpskom)

Iz HTML prototipa (`design-reference/components/00-...jsx`). Realne Next App
Router rute treba da prate ova imena:

| Ruta | Stranica | v1? |
|------|----------|-----|
| `/` | Naslovna (3 varijante: Editorial A / Marketplace B / Magazin C) | ✅ |
| `/katalog` | Katalog (`?cat=`, `?q=`; varijante Sidebar/Masonry) | ✅ |
| `/proizvod/:id` | Stranica proizvoda | ✅ (akcija = kontakt, ne korpa) |
| `/radnja/:id` | Profil radnje (proizvodi, video, o radnji, recenzije) | ✅ |
| `/radnje` | Sve radnje | ✅ |
| `/magazin` / `/magazin/:id` | Priče / pojedinačna priča | ✅ |
| `/postani-prodavac` | Landing za prodavce | ✅ |
| `/o-nama`, `/kontakt`, `/pomoc`, `/uslovi`, `/privatnost` | Statičke | ✅ |
| `/profil` (`/omiljeno`, `/porudzbine`) | Profil kupca | ✅ (bez plaćanja) |
| `/prodavac` (+ taby: proizvodi, porudzbine, video, poruke, analiza, radnja, dodaj) | Panel prodavca | ✅ |
| `/admin` (+ taby: radnje, proizvodi, kupci, recenzije, placanja) | Admin panel | ✅ (osim „placanja" = van opsega) |
| `/login`, `/register` (`?as=seller`) | Auth | ✅ (preko Clerk-a) |
| `/korpa`, `/checkout` | Korpa / plaćanje | ❌ **VAN v1** |

---

## 6. `design-reference/` — kako se koristi

Folder je **vizuelna referenca**, NE kod za kopiranje. Komponente su izvučene
iz jednog HTML artifakt-prototipa (React+Babel, inline stilovi, `zw-*` CSS
klase, hash-router, `WStore` kontekst, globalne `navigate`/`useRoute`/
`wFmtPrice`). Služe da „vidiš" kako sajt treba da izgleda.

**Pravilan tok pri gradnji stranice:**
1. Pogledaj odgovarajući `.jsx` iz `design-reference/components/`.
2. Napravi **pravu Next.js (App Router) stranicu** koristeći: tokene iz
   `globals.css`, **shadcn/ui** komponente, **`Icon`** (bez emoji),
   responsive Tailwind (ne inline px), Server Components gde ima smisla.
3. **Izbaci korpu/checkout/plaćanje** (v1 opseg) → zameni kontaktom.
4. Redosled gradnje: layout/nav/footer → naslovna → katalog → proizvod →
   radnja → magazin → auth → panel prodavca → admin.

**Inventar prototipa:** `00` rute+tema, `01` Logo/TopNav/Footer/ProductCard/
Page wrapper, `02` seed podaci+store, `03` ikonice, `04` naslovna A,
`05` naslovna B i C, `06` proizvod+radnja, `07` korpa+checkout (van opsega),
`08` admin+auth+postani-prodavac, `09` panel prodavca + dodaj proizvod (4 koraka).

---

## 7. Kako da radiš sa mnom (Ivana)

- **Objašnjavaj izmene na srpskom**, jednostavnim jezikom, u **3 kratka koraka**.
- **Daji kompletne fajlove**, ne parcijalne isečke (osim ako tražim drugačije).
- **Pitaj pre velikih izmena** (nove zavisnosti, promena strukture, brisanje).
- Poštuj v1 opseg — ako nešto vodi ka plaćanju/korpi, **stani i pitaj**.
