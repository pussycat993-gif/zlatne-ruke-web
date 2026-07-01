import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Kpi } from "@/components/panel/kpi";
import { toneClass } from "@/lib/data";
import { getShopProducts } from "@/lib/db/queries";
import { getOrCreateSellerShop } from "@/lib/seller";

export const metadata: Metadata = { title: "Pregled — Panel prodavca" };

export default async function SellerOverviewPage() {
  const myShop = await getOrCreateSellerShop();
  if (!myShop) return <p className="text-ink">Radnja nije dostupna.</p>;
  const myProducts = await getShopProducts(myShop.id);

  return (
    <div>
      <div className="mb-7">
        <div className="font-mono text-xs uppercase tracking-wider text-ink">
          Pregled · maj 2026
        </div>
        <h1 className="mt-1 font-heading text-3xl font-semibold text-foreground">
          Dobro došla,{" "}
          <span className="font-script font-normal text-pink">
            {myShop.owner.split(" ")[0]}
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Pregledi radnje" value="1.247" delta="+128 ove nedelje" />
        <Kpi label="Proizvoda" value={String(myProducts.length)} />
        <Kpi label="Pratilaca" value={String(myShop.followers)} delta="+12" />
        <Kpi label="Prosečna ocena" value={`★ ${myShop.rating}`} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        {/* Tvoji proizvodi */}
        <div className="rounded-2xl border border-line-soft bg-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Tvoji proizvodi
            </h2>
            <Link
              href="/prodavac/proizvodi"
              className="text-sm font-semibold text-pink hover:text-pink-dark"
            >
              Svi →
            </Link>
          </div>
          <div className="space-y-3">
            {myProducts.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className={`size-11 shrink-0 rounded-lg ${toneClass[p.tone]}`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-pink-dark">
                    {p.name}
                  </div>
                  <div className="font-mono text-xs text-ink">
                    {p.inStock} kom · ★ {p.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video CTA */}
        <div className="rounded-2xl bg-gradient-to-br from-pink-light to-cream p-6">
          <span className="flex size-11 items-center justify-center rounded-full bg-surface text-pink-dark">
            <Icon name="camera" size={22} />
          </span>
          <h2 className="mt-4 font-heading text-lg font-semibold text-foreground">
            Dodaj video radionice
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            Radnje sa video sadržajem privuku znatno više posetilaca. Dodaj
            kratak snimak procesa rada.
          </p>
          <Button asChild size="default" className="mt-4">
            <Link href="/prodavac/radnja">Uredi radnju</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
