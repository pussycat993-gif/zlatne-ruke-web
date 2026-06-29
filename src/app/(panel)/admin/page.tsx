import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Kpi } from "@/components/panel/kpi";
import { getAllShops, getAllProducts, getAllReviews } from "@/lib/db/queries";

export const metadata: Metadata = { title: "Pregled — Admin" };

export default async function AdminOverviewPage() {
  const [shops, products, reviews] = await Promise.all([
    getAllShops(),
    getAllProducts(),
    getAllReviews(),
  ]);
  const topShops = [...shops]
    .sort((a, b) => b.followers - a.followers)
    .slice(0, 5);
  const topProducts = [...products]
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 5);
  const totalViews = products.reduce((s, p) => s + (p.views ?? 0), 0);

  return (
    <div>
      <div className="mb-7">
        <div className="font-mono text-xs uppercase tracking-wider text-ink">
          Admin
        </div>
        <h1 className="mt-1 font-heading text-3xl font-semibold text-foreground">
          Platforma — pregled
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Aktivnih radnji" value={String(shops.length)} />
        <Kpi label="Proizvoda" value={String(products.length)} />
        <Kpi label="Recenzija" value={String(reviews.length)} />
        <Kpi label="Pregledi proizvoda" value={String(totalViews)} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
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

        <div className="rounded-2xl border border-line-soft bg-surface p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">
            Najbolje ocenjeni proizvodi
          </h2>
          <div className="divide-y divide-line-soft">
            {topProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0"
              >
                <span className="truncate text-sm font-semibold text-pink-dark">
                  {p.name}
                </span>
                <span className="flex shrink-0 items-center gap-1 text-sm text-ink">
                  <Icon name="star" size={14} filled className="text-pink" />
                  {p.rating} ({p.reviewCount})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
