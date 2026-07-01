import Link from "next/link";
import type { Metadata } from "next";
import { Icon, type IconName } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/site/section-header";
import { BecomeSellerButton } from "@/components/site/become-seller-button";
import { formatPrice, toneClass } from "@/lib/data";

export const metadata: Metadata = {
  title: "Postani prodavac — Zlatne Ruke",
  description:
    "Otvori radnju za nekoliko minuta. Bez provizije prve godine. Prodaj rukotvorine na celu Srbiju.",
};

const STEPS: { n: string; icon: IconName; t: string; d: string }[] = [
  {
    n: "01",
    icon: "package",
    t: "Otvori radnju",
    d: "Naziv, lokacija, kratak opis. Bez papirologije i bez startnih troškova.",
  },
  {
    n: "02",
    icon: "image",
    t: "Dodaj proizvode",
    d: "Slike, opis, cena. Naši šabloni pomažu da napišeš lepe opise i predstaviš rad.",
  },
  {
    n: "03",
    icon: "sparkle",
    t: "Mi šaljemo kupce",
    d: "Radnja se odmah pojavljuje u katalogu i pretragama. Kupci ti pišu direktno.",
  },
];

const BENEFITS = [
  "Bez provizije — zadržavaš 100% od svake prodaje",
  "Bez startnih troškova i bez mesečne pretplate",
  "Sama dogovaraš plaćanje i dostavu sa kupcem",
  "Tehnička podrška na srpskom",
  "Marketing uključen (Google, Instagram)",
];

const TESTIMONIALS = [
  { n: "Mila Petrović", s: "Mila & Konac · Novi Sad", q: "Pre Zlatnih Ruku pletila sam samo za bakine prijateljice. Sad mi šalovi stižu do Beča — i sve to dok mi deca spavaju." },
  { n: "Jelena Đorđević", s: "Zrno Srebra · Niš", q: "Najbolje je što ne moram da brinem ni o čemu osim o radu. Samo kujem srebro i pišem kupcima kad pitaju." },
  { n: "Sofija Marković", s: "Bosiljkov Vrt · Subotica", q: "Imala sam 4 prodaje mesečno preko Instagrama. Ovde ljudi tačno znaju šta traže." },
];

export default function BecomeSellerPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div>
            <div className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink">
              Za majstorice & kreatorke
            </div>
            <h1 className="text-balance font-heading text-5xl font-semibold leading-[0.98] text-foreground md:text-7xl">
              Tvoje ruke{" "}
              <span className="font-script font-normal text-pink">zaslužuju</span>{" "}
              tržište.
            </h1>
            <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-ink md:text-lg">
              Otvori radnju za nekoliko minuta. Prodaj na celu Srbiju. Mi se
              brinemo o sajtu i vidljivosti — ti pleti, mesi, kuj. Bez provizije,
              bez mesečne pretplate.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <BecomeSellerButton>Otvori radnju</BecomeSellerButton>
              <Button asChild size="cta" variant="outline">
                <Link href="/magazin">Pročitaj priče prodavačica</Link>
              </Button>
            </div>
            <div className="mt-10 flex gap-8">
              <Stat n="247" l="aktivnih radnji" />
              <Stat n="38" l="gradova" />
              <Stat n="0 RSD" l="provizija po prodaji" />
            </div>
          </div>

          {/* Kolaž slika */}
          <div className="relative h-[420px] md:h-[520px]">
            <div className={`absolute left-0 top-0 h-72 w-56 -rotate-3 rounded-3xl ${toneClass.v3}`} />
            <div className={`absolute right-2 top-14 h-80 w-52 rotate-3 rounded-3xl ${toneClass.v4}`} />
            <div className={`absolute bottom-0 left-12 h-56 w-48 -rotate-1 rounded-3xl ${toneClass.v2}`} />
          </div>
        </div>
      </section>

      {/* Kako počinje */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeader eyebrow="Kako počinje" title="Tri koraka do prve prodaje" />
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-3xl border border-line-soft bg-surface p-8">
                <div className="font-mono text-xs font-semibold uppercase tracking-wider text-ink">
                  {s.n}
                </div>
                <span className="mt-3 flex size-11 items-center justify-center rounded-full bg-pink-light text-pink-dark">
                  <Icon name={s.icon} size={22} />
                </span>
                <h3 className="mt-5 font-heading text-xl font-semibold text-foreground">
                  {s.t}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cena */}
      <section className="bg-surface py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-8 lg:grid-cols-2">
          <div>
            <div className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink">
              Cena
            </div>
            <h2 className="mt-3 font-heading text-4xl font-semibold text-foreground md:text-5xl">
              Trenutno{" "}
              <span className="font-script font-normal text-pink">besplatno.</span>
            </h2>
            <p className="mt-4 max-w-lg text-pretty leading-relaxed text-ink">
              Dok gradimo zajednicu, ne naplaćujemo proviziju — ni startne
              troškove, ni pretplatu. Kad uvedemo cenovnik, javljamo se mesec dana
              unapred, a prvih 100 prodavaca dobija trajni popust.
            </p>
            <ul className="mt-6 space-y-2.5">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-ink">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-pink-light text-pink-dark">
                    <Icon name="check" size={12} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-pink-light to-cream p-8 md:p-10">
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-ink">
              Primer prodaje
            </div>
            <div className="mt-4 space-y-0">
              <PriceRow l="Cena proizvoda" v={formatPrice(4800)} />
              <PriceRow l="Provizija Zlatne Ruke" v="−0 RSD" muted />
              <div className="mt-2 flex justify-between border-t border-line-soft pt-4 text-lg font-bold text-pink-dark">
                <span>Tvoj prihod</span>
                <span>{formatPrice(4800)}</span>
              </div>
            </div>
            <p className="mt-5 rounded-2xl bg-surface px-4 py-3 text-xs leading-relaxed text-ink">
              Mila & Konac: prosečno 12 šalova mesečno × 4.800 ={" "}
              <strong className="text-pink-dark">57.600 RSD mesečno</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Glasovi */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeader
            eyebrow="Glasovi prodavačica"
            title="Šta kažu majstorice koje već prodaju kod nas"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.n} className="rounded-3xl border border-line-soft bg-surface p-7">
                <div className="font-script text-4xl leading-none text-pink">
                  &ldquo;
                </div>
                <blockquote className="mt-2 text-pretty text-sm leading-relaxed text-ink">
                  {t.q}
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-pink-light font-semibold text-pink-dark">
                    {t.n[0]}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-pink-dark">
                      {t.n}
                    </span>
                    <span className="block font-mono text-xs uppercase tracking-wide text-ink">
                      {t.s}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-hero py-16 text-center text-hero-foreground md:py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-balance font-heading text-4xl font-semibold md:text-5xl">
            Spremna da otvoriš{" "}
            <span className="font-script font-normal text-pink">
              svoju radnju?
            </span>
          </h2>
          <BecomeSellerButton className="mt-8 bg-surface text-pink-dark hover:bg-surface/90">
            Krenimo — besplatno je
          </BecomeSellerButton>
        </div>
      </section>
    </>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="text-3xl font-bold leading-none text-pink-dark">{n}</div>
      <div className="mt-1.5 font-mono text-xs tracking-wide text-ink">{l}</div>
    </div>
  );
}

function PriceRow({ l, v, muted }: { l: string; v: string; muted?: boolean }) {
  return (
    <div
      className={`flex justify-between py-2.5 text-sm ${muted ? "text-ink" : "text-pink-dark"}`}
    >
      <span>{l}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}
