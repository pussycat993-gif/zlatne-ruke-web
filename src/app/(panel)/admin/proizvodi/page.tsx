import type { Metadata } from "next";
import { formatPrice, toneClass } from "@/lib/data";
import { getAllProducts, getShopNameMap } from "@/lib/db/queries";

export const metadata: Metadata = { title: "Proizvodi — Admin" };

export default async function AdminProductsPage() {
  const [products, shopNames] = await Promise.all([
    getAllProducts(),
    getShopNameMap(),
  ]);

  return (
    <div>
      <h1 className="mb-2 font-heading text-2xl font-semibold text-foreground md:text-3xl">
        Proizvodi ({products.length})
      </h1>
      <p className="mb-6 text-sm text-ink">
        Pregled svih aktivnih proizvoda na platformi.
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="overflow-hidden rounded-2xl border border-line-soft bg-surface"
          >
            <div className={`aspect-[5/4] w-full ${toneClass[p.tone]}`} />
            <div className="p-3">
              <div className="truncate text-sm font-semibold text-pink-dark">
                {p.name}
              </div>
              <div className="mt-1 text-xs text-ink">
                {shopNames.get(p.shopId)}
              </div>
              <div className="mt-1.5 text-sm font-bold text-pink-dark">
                {formatPrice(p.price)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
