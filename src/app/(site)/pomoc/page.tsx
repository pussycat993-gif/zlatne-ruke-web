import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Crumbs } from "@/components/site/crumbs";

export const metadata: Metadata = {
  title: "Česta pitanja - Zlatne Ruke",
  description: "Odgovori na česta pitanja kupaca i prodavaca.",
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "Kako kupujem na Zlatnim Rukama?",
    a: "Zlatne Ruke su katalog. Kada nađeš predmet, pošalješ upit majstorici preko stranice proizvoda. Plaćanje i dostavu dogovarate direktno, na način koji vama dvema najviše odgovara.",
  },
  {
    q: "Da li platforma naplaćuje proviziju?",
    a: "Prodavcima prve godine ne naplaćujemo proviziju - zadržavaju 100% od svake prodaje. Kupcima je korišćenje kataloga uvek besplatno.",
  },
  {
    q: "Kako se dogovara dostava?",
    a: "Dostavu organizuje sama majstorica i dogovara je sa tobom u poruci (kurirska služba, pošta ili lično preuzimanje). Cena i rok zavise od radnje.",
  },
  {
    q: "Kako da otvorim svoju radnju?",
    a: "Idi na stranicu Postani prodavac, popuni osnovne podatke o radnji i dodaj proizvode. Otvaranje radnje je besplatno i traje nekoliko minuta.",
  },
  {
    q: "Mogu li da vratim proizvod?",
    a: "Pošto je svaki predmet ručno rađen i prodaja ide direktno preko majstorice, uslove povraćaja dogovaraš sa njom pre kupovine.",
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
      <Crumbs
        items={[{ label: "Početna", href: "/" }, { label: "Česta pitanja" }]}
      />

      <header className="mb-10">
        <h1 className="text-balance font-heading text-4xl font-semibold text-foreground md:text-5xl">
          Česta pitanja
        </h1>
        <p className="mt-3 text-sm text-ink md:text-base">
          Ne nalaziš odgovor?{" "}
          <a href="/kontakt" className="font-semibold text-pink hover:text-pink-dark">
            Piši nam
          </a>
          .
        </p>
      </header>

      <div className="space-y-3">
        {FAQ.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-line-soft bg-surface px-5 open:bg-cream"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold text-pink-dark">
              {item.q}
              <span className="shrink-0 text-pink transition-transform group-open:rotate-180">
                <Icon name="chevronDown" size={18} />
              </span>
            </summary>
            <p className="pb-4 text-sm leading-relaxed text-ink">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
