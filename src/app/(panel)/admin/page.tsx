import type { Metadata } from "next";
import { Kpi } from "@/components/panel/kpi";
import { toneClass } from "@/lib/data";
import { getAllShops, getAllProducts, getAllReviews } from "@/lib/db/queries";

export const metadata: Metadata = { title: "Pregled — Admin" };

const PENDING = [
  { n: "Svilena traka", s: "Marina Tekstil", d: "pre 2h" },
  { n: "Kožna torba", s: "Koža & Konac", d: "pre 5h" },
  { n: "Mirisni sapuni", s: "Bosiljkov Vrt", d: "pre 1 dan" },
];

export default async function AdminOverviewPage() {
  const [shops, products, reviews] = await Promise.all([
    getAllShops(),
    getAllProducts(),
    getAllReviews(),
  ]);
  const topShops = [...shops]
    .sort((a, b) => b.followers - a.followers)
    .slice(0, 5);

  return (
    <div>
      <div className="mb-7">
        <div className="font-mono text-xs uppercase tracking-wider text-ink">
          Admin · maj 2026
        </div>
        <h1 className="mt-1 font-heading text-3xl font-semibold text-foreground">
          Platforma — pregled
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Aktivnih radnji" value={String(shops.length)} delta="+2 ovaj mesec" />
        <Kpi label="Proizvoda" value={String(products.length)} delta="+5" />
        <Kpi label="Recenzija" value={String(reviews.length)} />
        <Kpi label="Pregledi (maj)" value="12.4k" delta="+22%" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {/* Čeka odobrenje */}
        <div className="rounded-2xl border border-line-soft bg-surface p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">
            Čeka odobrenje
          </h2>
          <div className="divide-y divide-line-soft">
            {PENDING.map((r) => (
              <div key={r.n} className="flex items-center gap-3 py-3 first:pt-0">
                <div className={`size-10 shrink-0 rounded-lg ${toneClass.v3}`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-pink-dark">
                    {r.n}
                  </div>
                  <div className="text-xs text-ink">
                    {r.s} · {r.d}
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-pink-dark transition-colors hover:bg-pink-light"
                >
                  Pregled
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Top radnje */}
        <div className="rounded-2xl border border-line-soft bg-surface p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">
            Najpraćenije radnje
          </h2>
          <div className="divide-y divide-line-soft">
            {topShops.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 py-3 first:pt-0">
                <span className="flex size-7 items-center justify-center rounded-full bg-pink-light text-xs font-bold text-pink-dark">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-pink-dark">
                    {s.name}
                  </div>
                  <div className="text-xs text-ink">{s.city}</div>
                </div>
                <span className="text-sm font-bold text-pink">
                  {s.followers}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
