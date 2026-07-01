import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { DeleteProductButton } from "@/components/panel/delete-product-button";
import { formatPrice, toneClass } from "@/lib/data";
import { getShopProducts } from "@/lib/db/queries";
import { getOrCreateSellerShop } from "@/lib/seller";

export const metadata: Metadata = { title: "Proizvodi - Panel prodavca" };

export default async function SellerProductsPage() {
  const myShop = await getOrCreateSellerShop();
  if (!myShop) return <p className="text-ink">Radnja nije dostupna.</p>;
  const myProducts = await getShopProducts(myShop.id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-semibold text-foreground md:text-3xl">
          Proizvodi
        </h1>
        <Button asChild size="default">
          <Link href="/prodavac/dodaj">
            <Icon name="plus" size={16} /> Novi proizvod
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface">
        {/* Zaglavlje tabele - samo na većim ekranima */}
        <div className="hidden grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-line-soft bg-cream px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wide text-ink md:grid">
          <span>Proizvod</span>
          <span className="w-24 text-right">Cena</span>
          <span className="w-20 text-right">Zalihe</span>
          <span className="w-36 text-right">Akcije</span>
        </div>
        {myProducts.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center gap-4 border-b border-line-soft px-5 py-3 last:border-0 md:grid md:grid-cols-[1fr_auto_auto_auto]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className={`size-12 shrink-0 rounded-lg ${toneClass[p.tone]}`} />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-pink-dark">
                  {p.name}
                </div>
                <div className="font-mono text-xs text-ink">
                  ★ {p.rating} · {p.reviewCount} recenzija
                </div>
              </div>
            </div>
            <div className="w-24 text-right text-sm font-bold text-pink-dark">
              {formatPrice(p.price)}
            </div>
            <div className="w-20 text-right text-sm text-ink">{p.inStock} kom</div>
            <div className="flex w-36 justify-end gap-2">
              <Link
                href={`/prodavac/proizvodi/${p.id}/uredi`}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-pink-dark transition-colors hover:bg-pink-light"
              >
                <Icon name="edit" size={13} /> Uredi
              </Link>
              <DeleteProductButton productId={p.id} productName={p.name} />
            </div>
          </div>
        ))}
        {myProducts.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-ink">
            Još nemaš proizvode.{" "}
            <Link
              href="/prodavac/dodaj"
              className="font-semibold text-pink hover:text-pink-dark"
            >
              Dodaj prvi
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
