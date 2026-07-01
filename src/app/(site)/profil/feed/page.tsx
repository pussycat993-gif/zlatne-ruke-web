import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Crumbs } from "@/components/site/crumbs";
import { ProductCard } from "@/components/site/product-card";
import { getShopNameMap } from "@/lib/db/queries";
import {
  getFollowedShopProducts,
  getFavoriteProductIds,
  getFollowedShops,
} from "@/lib/user-data";

export const metadata: Metadata = {
  title: "Novo od radnji koje pratiš - Zlatne Ruke",
  robots: { index: false, follow: false },
};

export default async function FeedPage() {
  const [products, shopNames, favIds, followed] = await Promise.all([
    getFollowedShopProducts(24),
    getShopNameMap(),
    getFavoriteProductIds(),
    getFollowedShops(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
      <Crumbs
        items={[
          { label: "Početna", href: "/" },
          { label: "Profil", href: "/profil" },
          { label: "Novo od praćenih" },
        ]}
      />

      <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
        Novo od radnji{" "}
        <span className="font-script font-normal text-pink">koje pratiš</span>
      </h1>

      {products.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              shopName={shopNames.get(p.shopId)}
              favorited={favIds.has(p.id)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-line-soft bg-cream px-6 py-16 text-center">
          <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-surface text-pink">
            <Icon name="sparkle" size={26} />
          </span>
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            {followed.length === 0
              ? "Ne pratiš nijednu radnju"
              : "Još nema novih proizvoda"}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink">
            {followed.length === 0
              ? "Zaprati radnje da ovde vidiš njihove nove proizvode."
              : "Radnje koje pratiš još nisu dodale nove proizvode. Navrati kasnije."}
          </p>
          <Button asChild size="default" className="mt-6">
            <Link href="/radnje">Pogledaj radnje</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
