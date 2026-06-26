import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Crumbs } from "@/components/site/crumbs";
import { ProductCard } from "@/components/site/product-card";
import { getShopNameMap } from "@/lib/db/queries";
import { getFavoriteProducts } from "@/lib/user-data";

export const metadata: Metadata = { title: "Omiljeno — Zlatne Ruke" };

export default async function FavoritesPage() {
  const [products, shopNames] = await Promise.all([
    getFavoriteProducts(),
    getShopNameMap(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
      <Crumbs
        items={[
          { label: "Početna", href: "/" },
          { label: "Profil", href: "/profil" },
          { label: "Omiljeno" },
        ]}
      />

      <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
        Omiljeno{" "}
        {products.length > 0 && (
          <span className="text-lg font-medium text-ink">
            ({products.length})
          </span>
        )}
      </h1>

      {products.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              shopName={shopNames.get(p.shopId)}
              favorited
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-line-soft bg-cream px-6 py-16 text-center">
          <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-surface text-pink">
            <Icon name="heart" size={26} />
          </span>
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Još nemaš sačuvane predmete
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink">
            Klikni na srce na proizvodu da ga sačuvaš ovde.
          </p>
          <Link
            href="/katalog"
            className="mt-6 inline-flex rounded-full bg-pink px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-pink-dark"
          >
            Istraži katalog
          </Link>
        </div>
      )}
    </div>
  );
}
