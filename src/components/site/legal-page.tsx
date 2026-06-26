import { Crumbs } from "@/components/site/crumbs";

export type LegalSection = { h: string; p: string[] };

// Zajednički raspored za pravne/tekstualne strane (Uslovi, Privatnost).
export function LegalPage({
  title,
  crumb,
  updated,
  intro,
  sections,
}: {
  title: string;
  crumb: string;
  updated: string;
  intro?: string;
  sections: LegalSection[];
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 md:px-8">
      <Crumbs items={[{ label: "Početna", href: "/" }, { label: crumb }]} />

      <header className="mb-10">
        <h1 className="font-heading text-4xl font-semibold text-foreground md:text-5xl">
          {title}
        </h1>
        <p className="mt-3 font-mono text-xs tracking-wide text-ink-soft">
          Poslednje ažuriranje: {updated}
        </p>
        {intro && (
          <p className="mt-5 text-pretty leading-relaxed text-ink">{intro}</p>
        )}
        <p className="mt-4 rounded-2xl bg-pink-light px-4 py-3 text-xs leading-relaxed text-pink-dark">
          Napomena: ovo je radni nacrt teksta i nije pravni savet. Pre objave
          uživo proveriti sa pravnikom.
        </p>
      </header>

      <div className="space-y-8">
        {sections.map((s, i) => (
          <section key={i}>
            <h2 className="font-heading text-xl font-semibold text-foreground">
              {i + 1}. {s.h}
            </h2>
            <div className="mt-3 space-y-3 leading-relaxed text-ink">
              {s.p.map((para, j) => (
                <p key={j}>{para}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
