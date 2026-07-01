import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Uslovi korišćenja - Zlatne Ruke",
  description: "Uslovi korišćenja platforme Zlatne Ruke.",
};

const SECTIONS: LegalSection[] = [
  {
    h: "O platformi",
    p: [
      "Zlatne Ruke su katalog i oglasna platforma koja povezuje žene zanatlije iz Srbije sa kupcima. Platforma omogućava prikaz proizvoda i radnji i kontakt između kupca i prodavca.",
      "Zlatne Ruke nisu strana u kupoprodaji. Prodaju, plaćanje i dostavu dogovaraju kupac i prodavac direktno.",
    ],
  },
  {
    h: "Nalozi",
    p: [
      "Za pojedine funkcije (omiljeno, praćenje radnji, otvaranje radnje) potreban je nalog. Korisnik je odgovoran za tačnost podataka i čuvanje pristupnih podataka.",
    ],
  },
  {
    h: "Obaveze prodavaca",
    p: [
      "Prodavac garantuje da su objavljeni proizvodi njegov ručni rad ili u skladu sa pravilima platforme, te da su opis, cena i dostupnost tačni.",
      "Prodavac samostalno dogovara i sprovodi plaćanje i dostavu sa kupcem.",
    ],
  },
  {
    h: "Sadržaj",
    p: [
      "Zabranjeno je objavljivanje nezakonitog, uvredljivog ili sadržaja koji krši prava trećih lica. Zlatne Ruke zadržavaju pravo da uklone takav sadržaj.",
    ],
  },
  {
    h: "Odgovornost",
    p: [
      "Platforma se trudi da obezbedi tačan prikaz, ali ne garantuje za sadržaj koji objavljuju prodavci niti za ishod dogovora između kupca i prodavca.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Uslovi korišćenja"
      crumb="Uslovi korišćenja"
      updated="jun 2026"
      intro="Korišćenjem platforme Zlatne Ruke prihvataš sledeće uslove."
      sections={SECTIONS}
    />
  );
}
