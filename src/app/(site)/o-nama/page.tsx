import Link from "next/link";
import type { Metadata } from "next";
import { Icon, type IconName } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Crumbs } from "@/components/site/crumbs";
import { toneClass } from "@/lib/data";

export const metadata: Metadata = {
  title: "O nama — Zlatne Ruke",
  description:
    "Zlatne Ruke povezuju žene zanatlije iz Srbije sa kupcima. Svaki predmet ima ime, mesto i priču.",
};

const VALUES: { icon: IconName; t: string; d: string }[] = [
  { icon: "chat", t: "Direktan kontakt", d: "Pišeš majstorici, ne botu. Plaćanje i dostavu dogovarate zajedno." },
  { icon: "tag", t: "Bez provizije", d: "Prve godine prodavci zadržavaju 100% od svake prodaje." },
  { icon: "flower", t: "Na srpskom, za Srbiju", d: "Lokalne radnje, lokalna podrška, lokalna dostava." },
  { icon: "heart", t: "Bez fast fashion-a", d: "Male serije, prava kvaliteta, predmeti koji traju." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 md:px-8">
      <Crumbs items={[{ label: "Početna", href: "/" }, { label: "O nama" }]} />

      <header className="mb-12">
        <div className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink">
          O nama
        </div>
        <h1 className="text-balance font-heading text-4xl font-semibold leading-tight text-foreground md:text-6xl">
          Kad žena stvara srcem,{" "}
          <span className="font-script font-normal text-pink">
            nastaje magija.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-ink md:text-lg">
          Zlatne Ruke su katalog i magazin koji povezuju žene zanatlije iz cele
          Srbije sa kupcima. Ne pravimo predmete mi — prave ih one. Mi samo
          otvaramo vrata između njihovih ruku i tvog doma.
        </p>
      </header>

      <div
        className={`aspect-[16/9] w-full rounded-3xl shadow-[var(--zr-shadow)] ${toneClass.v3}`}
      />

      <section className="mt-14 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Naša priča
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-ink">
            Počeli smo sa jednostavnom idejom: svaki ručno rađen predmet
            zaslužuje da nosi ime svoje autorke. Previše talentovanih žena
            prodaje preko prepunih grupa i poruka, bez mesta koje je samo
            njihovo.
          </p>
          <p className="mt-4 text-pretty leading-relaxed text-ink">
            Zato gradimo prostor gde svaka majstorica ima svoju radnju, svoju
            priču i direktnu vezu sa kupcima — bez posrednika i bez pritiska
            velikih platformi.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.t} className="rounded-2xl bg-cream p-5">
              <span className="flex size-11 items-center justify-center rounded-full bg-surface text-pink-dark">
                <Icon name={v.icon} size={20} />
              </span>
              <h3 className="mt-3 text-sm font-bold text-pink-dark">{v.t}</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-3xl bg-hero px-6 py-12 text-center text-hero-foreground md:py-16">
        <h2 className="text-balance font-heading text-3xl font-semibold md:text-4xl">
          Ti praviš?{" "}
          <span className="font-script font-normal text-pink">
            Dođi kod nas.
          </span>
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-current/80">
          Otvori radnju za nekoliko minuta. Bez provizije prve godine.
        </p>
        <Button
          asChild
          size="cta"
          className="mt-7 bg-surface text-pink-dark hover:bg-surface/90"
        >
          <Link href="/postani-prodavac">Postani prodavac</Link>
        </Button>
      </section>
    </div>
  );
}
