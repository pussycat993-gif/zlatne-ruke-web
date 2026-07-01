import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Kpi } from "@/components/panel/kpi";
import { getShopProducts } from "@/lib/db/queries";
import { getOrCreateSellerShop } from "@/lib/seller";
import { getSellerConversations } from "@/lib/messages";

export const metadata: Metadata = { title: "Statistika - Panel prodavca" };

export default async function SellerStatsPage() {
  const myShop = await getOrCreateSellerShop();
  if (!myShop) return <p className="text-ink">Radnja nije dostupna.</p>;

  const [products, conversations] = await Promise.all([
    getShopProducts(myShop.id),
    getSellerConversations(),
  ]);

  const topProducts = [...products]
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 5);
  const productViews = products.reduce((s, p) => s + (p.views ?? 0), 0);

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-semibold text-foreground md:text-3xl">
        Statistika
      </h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Pregledi radnje" value={String(myShop.views)} />
        <Kpi label="Pregledi proizvoda" value={String(productViews)} />
        <Kpi label="Pratilaca" value={String(myShop.followers)} />
        <Kpi label="Recenzija" value={String(myShop.reviews)} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-line-soft bg-surface p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">
            Najbolje ocenjeni proizvodi
          </h2>
          {topProducts.length > 0 ? (
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
          ) : (
            <p className="text-sm text-ink">Još nemaš proizvode.</p>
          )}
        </div>

        <div className="rounded-2xl border border-line-soft bg-surface p-6">
          <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">
            Razgovori
          </h2>
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-pink-light text-pink-dark">
              <Icon name="chat" size={20} />
            </span>
            <div>
              <div className="text-2xl font-bold text-pink-dark">
                {conversations.length}
              </div>
              <div className="text-sm text-ink">aktivnih razgovora</div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-ink-soft">
        Pregledi se broje za svaku posetu stranice (osim tvojih). Tvoji pregledi
        se ne računaju.
      </p>
    </div>
  );
}
