# Zlatne Ruke — Referentni dizajn (izvučen iz HTML prototipa)

Ovaj folder je **referenca dizajna**, ne gotov kod za projekat. Komponente su
izvučene iz artifakt-prototipa (React + Babel u jednom HTML fajlu) i služe da
Claude Code "vidi" kako sajt treba da izgleda kada bude pravio prave Next.js
stranice. Ne kopiraju se direktno u projekat (koriste pomoćne funkcije iz
prototipa: `navigate`, `useRoute`, `wFmtPrice`, `WStoreProvider`...).

---

## Prava paleta (izvor istine)

### Svetla tema (default)
| Uloga            | Token             | Boja      |
|------------------|-------------------|-----------|
| Primarna (roze)  | `--zr-pink`       | `#C0637A` |
| Tamno roze       | `--zr-pink-dark`  | `#A0445A` |
| Svetlo roze      | `--zr-pink-light` | `#F5ECEE` |
| Roze tint        | `--zr-pink-tint`  | `#FBE7EC` |
| Krem (pozadina)  | `--zr-cream`      | `#FDF6F0` |
| Površina / kartice | `--zr-surface`  | `#FFFFFF` |
| Tekst sivi       | `--zr-gray`       | `#7A6068` |
| Ivice            | `--zr-border`     | `#E8C8D0` |
| Hero pozadina    | `--zr-hero-bg`    | `#A0445A` |

### Tamna tema
U dark modu **roze tokeni nose zlatnu ulogu** (topli brown-burgundy, nikad crno):
primarna `#D4A155`, svetlo zlatna `#E8BB6D`, pozadina `#14100F`.

Kompletni tokeni za oba moda su u `DESIGN-TOKENS.css`.

## Fontovi (prava tipografija)
- **DM Sans** — telo i naslovi (`--zr-font`, `--zr-font-display`)
- **Caveat** — rukopisni akcenti (`--zr-font-script`)
- **JetBrains Mono** — mono detalji / labele (`--zr-font-mono`)

> Napomena: ovo se razlikuje od prvog hero-a koji smo napravili
> (Cormorant Garamond + Dancing Script). Prototip je novija, "prava" verzija —
> hero treba uskladiti sa DM Sans + Caveat i bojom `#C0637A`.

---

## Šta sve postoji u prototipu (inventar stranica)

| Fajl | Sadrži |
|------|--------|
| `00-app-entry-routing-theme.jsx` | Ulazna tačka: rute, tema (light/dark), default tokeni |
| `01-layout-nav-footer-cards.jsx` | Logo, TopNav, ThemeToggle, MegaMenu, Footer, kartica proizvoda, Page wrapper |
| `02-store-provider-data.jsx`     | Globalno stanje / podaci (prodavnice, proizvodi, korpa) |
| `03-icons.jsx`                   | Custom SVG ikonice (bez emoji-ja) |
| `04-homepage-A.jsx`              | Naslovna — varijanta A |
| `05-homepage-B-and-C.jsx`        | Naslovna — varijante B i C |
| `06-product-and-shop-page.jsx`   | Stranica proizvoda + profil radnje |
| `07-cart-and-checkout.jsx`       | Korpa + checkout  ⚠️ vidi napomenu o opsegu |
| `08-admin-auth-becomeseller.jsx` | Admin panel, prijava/registracija, "Postani prodavac" |
| `09-seller-dashboard-addproduct.jsx` | Panel prodavca (porudžbine, proizvodi, analitika...) + dodavanje proizvoda (4 koraka) |

---

## ⚠️ Važno: opseg v1 vs. prototip

Dogovoreni opseg v1 je **katalog / oglasna platforma — bez plaćanja**
(prodavci rešavaju plaćanje i dostavu van platforme). Ali prototip **sadrži
korpu, checkout, "Besplatna dostava", formatiranje cene i Admin → Plaćanja**.

Pre nego što Claude Code počne da gradi, treba odlučiti:
- **A)** Korpa/checkout se **izbacuju** iz v1 (dosledno dogovorenom opsegu), ili
- **B)** Ostaju **samo vizuelno** (dugme "Pošalji upit prodavcu" umesto kupovine), ili
- **C)** Opseg se menja i plaćanje ipak ulazi u v1.

Ovo je odluka koju treba doneti, jer menja koje stranice se uopšte prave.

---

## Kako ovo iskoristiti u Claude Code

1. Stavi ceo `design-reference/` folder u koren projekta `zlatne-ruke-web`.
2. Prvo prebaci tokene: sadržaj `DESIGN-TOKENS.css` ide u `app/globals.css`
   (pod `@layer base`), i poveži ih sa Tailwind temom.
3. Onda Claude Code-u daješ stranicu po stranicu, npr:
   *"Pogledaj `design-reference/components/04-homepage-A.jsx` i napravi pravu
   Next.js naslovnu u `app/page.tsx` koristeći naše tokene iz globals.css,
   shadcn/ui komponente i custom SVG ikonice — bez korpe/checkout-a (v1 opseg)."*
4. Gradi redom: layout/nav/footer → naslovna → katalog → proizvod → radnja →
   auth → panel prodavca → admin.
