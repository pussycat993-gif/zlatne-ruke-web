import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Politika privatnosti — Zlatne Ruke",
  description: "Kako Zlatne Ruke prikupljaju i koriste podatke.",
};

const SECTIONS: LegalSection[] = [
  {
    h: "Koje podatke prikupljamo",
    p: [
      "Prilikom otvaranja naloga prikupljamo ime, email adresu i osnovne podatke o radnji (za prodavce). Prilikom korišćenja sajta beležimo osnovne tehničke podatke (npr. tip uređaja) radi ispravnog rada platforme.",
    ],
  },
  {
    h: "Kako koristimo podatke",
    p: [
      "Podatke koristimo da omogućimo rad naloga, prikaz radnji i proizvoda, kontakt između kupaca i prodavaca i poboljšanje platforme.",
      "Ne prodajemo lične podatke trećim licima.",
    ],
  },
  {
    h: "Kolačići",
    p: [
      "Koristimo neophodne kolačiće za rad sajta (npr. čuvanje izabrane teme) i, uz tvoju saglasnost, kolačiće za statistiku korišćenja.",
    ],
  },
  {
    h: "Tvoja prava",
    p: [
      "Imaš pravo da zatražiš uvid, ispravku ili brisanje svojih podataka, kao i da povučeš saglasnost. Zahtev možeš poslati preko stranice Kontakt.",
    ],
  },
  {
    h: "Kontakt",
    p: [
      "Za sva pitanja o privatnosti piši nam na podrska@zlatneruke.rs.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Politika privatnosti"
      crumb="Privatnost"
      updated="jun 2026"
      intro="Tvoja privatnost nam je važna. Evo kako postupamo sa podacima."
      sections={SECTIONS}
    />
  );
}
