# Pravni tekstovi — za proveru sa pravnikom

> Ovo je **radni nacrt** trenutnih tekstova na sajtu (Uslovi korišćenja i
> Politika privatnosti) + spisak stvari koje pravnik treba da doda/potvrdi.
> Tekstovi se ne smatraju pravnim savetom dok ih advokat ne odobri.
>
> Lokacije u kodu: `src/app/(site)/uslovi/page.tsx`,
> `src/app/(site)/privatnost/page.tsx`.

Kontekst: Platforma je **katalog/oglasni prostor** (v1, BEZ plaćanja/korpe online).
Prodaju, plaćanje i dostavu kupac i prodavac dogovaraju direktno. Hosting Vercel,
baza Supabase, prijava Clerk, slike Cloudinary, analitika Vercel Analytics,
email Resend.

---

## 1) USLOVI KORIŠĆENJA (trenutni tekst)

**Uvod:** Korišćenjem platforme Zlatne Ruke prihvataš sledeće uslove.

**O platformi**
- Zlatne Ruke su katalog i oglasna platforma koja povezuje žene zanatlije iz Srbije sa kupcima. Platforma omogućava prikaz proizvoda i radnji i kontakt između kupca i prodavca.
- Zlatne Ruke nisu strana u kupoprodaji. Prodaju, plaćanje i dostavu dogovaraju kupac i prodavac direktno.

**Nalozi**
- Za pojedine funkcije (omiljeno, praćenje radnji, otvaranje radnje) potreban je nalog. Korisnik je odgovoran za tačnost podataka i čuvanje pristupnih podataka.

**Obaveze prodavaca**
- Prodavac garantuje da su objavljeni proizvodi njegov ručni rad ili u skladu sa pravilima platforme, te da su opis, cena i dostupnost tačni.
- Prodavac samostalno dogovara i sprovodi plaćanje i dostavu sa kupcem.

**Sadržaj**
- Zabranjeno je objavljivanje nezakonitog, uvredljivog ili sadržaja koji krši prava trećih lica. Zlatne Ruke zadržavaju pravo da uklone takav sadržaj.

**Odgovornost**
- Platforma se trudi da obezbedi tačan prikaz, ali ne garantuje za sadržaj koji objavljuju prodavci niti za ishod dogovora između kupca i prodavca.

---

## 2) POLITIKA PRIVATNOSTI (trenutni tekst)

**Uvod:** Tvoja privatnost nam je važna. Evo kako postupamo sa podacima.

**Koje podatke prikupljamo**
- Prilikom otvaranja naloga prikupljamo ime, email adresu i osnovne podatke o radnji (za prodavce). Prilikom korišćenja sajta beležimo osnovne tehničke podatke (npr. tip uređaja) radi ispravnog rada platforme.

**Kako koristimo podatke**
- Podatke koristimo da omogućimo rad naloga, prikaz radnji i proizvoda, kontakt između kupaca i prodavaca i poboljšanje platforme.
- Ne prodajemo lične podatke trećim licima.

**Kolačići**
- Koristimo neophodne kolačiće za rad sajta (npr. čuvanje izabrane teme) i, uz tvoju saglasnost, kolačiće za statistiku korišćenja.

**Tvoja prava**
- Imaš pravo da zatražiš uvid, ispravku ili brisanje svojih podataka, kao i da povučeš saglasnost. Zahtev možeš poslati preko stranice Kontakt.

**Kontakt**
- Za sva pitanja o privatnosti piši nam na podrska@zlatneruke.rs.

---

## 3) Šta pravnik treba da DODA / POTVRDI

### Identifikacija (obavezno — Zakon o elektronskoj trgovini, ZZP)
- [ ] Pun pravni naziv subjekta koji vodi platformu (preduzetnik/d.o.o.?)
- [ ] Sedište / adresa, matični broj, PIB, broj u APR-u
- [ ] Zvanični kontakt (email/telefon). **Trenutno je placeholder `podrska@zlatneruke.rs` — potvrditi pravi.**
- [ ] Datum stupanja na snagu (sad piše „jun 2026").

### Uslovi korišćenja — dopune
- [ ] Pravni status: platforma = posrednik/oglasni prostor; **prodavac je trgovac prema kupcu** (ko snosi obaveze po ZZP, npr. saobraznost, pravo na odustanak 14 dana — pošto prodaja ide van platforme).
- [ ] Pravila za prodavce: registracija, zabranjeni proizvodi, posledice kršenja, uklanjanje sadržaja, suspenzija/gašenje naloga.
- [ ] Intelektualna svojina (sadržaj korisnika i platforme).
- [ ] Ograničenje odgovornosti i „bez garancije" formulacije (uskladiti sa ZZP).
- [ ] Izmene uslova (kako i kada obaveštavate korisnike).
- [ ] Merodavno pravo (pravo Republike Srbije) i nadležni sud / rešavanje sporova; vansudsko rešavanje potrošačkih sporova.

### Politika privatnosti — dopune (Zakon o zaštiti podataka o ličnosti / GDPR)
- [ ] **Rukovalac** podacima (naziv + kontakt); po potrebi lice za zaštitu podataka.
- [ ] **Pravni osnov** obrade za svaku svrhu (saglasnost / izvršenje ugovora / legitimni interes).
- [ ] **Obrađivači (sub-procesori)** kojima se podaci poveravaju i lokacija obrade
      (mogući prenos van Srbije/EU): **Clerk** (nalozi), **Supabase** (baza),
      **Cloudinary** (slike), **Vercel** (hosting + Analytics), **Resend** (email).
- [ ] **Rok čuvanja** podataka po kategorijama.
- [ ] **Prava lica** (uvid, ispravka, brisanje, ograničenje, prenosivost, prigovor)
      + procedura i rok za odgovor + **pravo pritužbe Povereniku** za zaštitu podataka.
- [ ] **Kolačići — tačan spisak** i baner za saglasnost (vidi dole).

### Kolačići / saglasnost — TEHNIČKI NEDOSTATAK
- [ ] **Trenutno NEMA cookie baner / mehanizam saglasnosti.** Aktivni „kolačići"/
      skladištenje: `zr-theme` (localStorage, tema), Clerk (sesija/auth),
      Vercel Analytics. Ako se traži saglasnost za analitiku, treba baner i da se
      analitika ne učitava pre saglasnosti. Pravnik da odluči obim; ja mogu da
      ugradim baner kad bude jasno šta treba.

### Ostalo
- [ ] Uskladiti kontakt email svuda (footer, kontakt strana, privatnost) na isti, pravi.
- [ ] Po želji: stranica „Pravila za prodavce" i „Često postavljana pitanja" (već postoji `/pomoc`).
