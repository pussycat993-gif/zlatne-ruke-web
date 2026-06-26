import type { Metadata } from "next";
import { toneClass } from "@/lib/data";
import { getAllShops, getAllProducts } from "@/lib/db/queries";

export const metadata: Metadata = { title: "Radnje — Admin" };

export default async function AdminShopsPage() {
  const [shops, products] = await Promise.all([
    getAllShops(),
    getAllProducts(),
  ]);
  const productCounts = new Map<string, number>();
  for (const p of products) {
    productCounts.set(p.shopId, (productCounts.get(p.shopId) ?? 0) + 1);
  }

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-semibold text-foreground md:text-3xl">
        Radnje ({shops.length})
      </h1>

      <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface">
        <div className="hidden grid-cols-[1fr_1fr_auto_auto] gap-4 border-b border-line-soft bg-cream px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wide text-ink md:grid">
          <span>Radnja</span>
          <span>Vlasnica</span>
          <span className="w-24 text-right">Proizvodi</span>
          <span className="w-20 text-right">Status</span>
        </div>
        {shops.map((s) => (
          <div
            key={s.id}
            className="flex flex-wrap items-center gap-4 border-b border-line-soft px-5 py-3 last:border-0 md:grid md:grid-cols-[1fr_1fr_auto_auto]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className={`size-10 shrink-0 rounded-lg ${toneClass[s.tone]}`} />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-pink-dark">
                  {s.name}
                </div>
                <div className="text-xs text-ink">
                  {s.city} · ★ {s.rating}
                </div>
              </div>
            </div>
            <div className="text-sm text-ink">{s.owner}</div>
            <div className="w-24 text-right text-sm text-ink">
              {productCounts.get(s.id) ?? 0}
            </div>
            <div className="w-20 text-right">
              <span className="rounded-full bg-pink-light px-2.5 py-1 text-xs font-bold text-pink-dark">
                Aktivna
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
