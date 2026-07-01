import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice, toneClass } from "@/lib/data";
import { PageHead } from "@/components/admin/page-head";
import { EmptyState } from "@/components/admin/empty-state";
import { ActionButton } from "@/components/admin/action-button";
import { adminDeleteProduct } from "@/lib/admin-actions";
import { getAdminProducts } from "@/lib/db/admin";

export const metadata: Metadata = { title: "Proizvodi — Admin" };

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <>
      <PageHead
        eyebrow={`${products.length} proizvoda`}
        title="Proizvodi za"
        accent="moderaciju"
      />

      {products.length === 0 ? (
        <EmptyState
          title="Nema proizvoda"
          text="Kad prodavci dodaju proizvode, pojaviće se ovde."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-line-soft bg-surface"
            >
              <div className={`aspect-[5/4] w-full ${toneClass[p.tone as keyof typeof toneClass]}`} />
              <div className="flex flex-1 flex-col p-3">
                <div className="text-xs text-ink">
                  {p.shopName} · {p.city}
                </div>
                <div className="mt-0.5 line-clamp-2 text-sm font-semibold text-pink-dark">
                  {p.name}
                </div>
                <div className="mt-1 text-sm font-bold text-pink-dark">
                  {formatPrice(p.price)}
                </div>
                <div className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-wide text-ink">
                  dodato {p.when}
                </div>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/proizvod/${p.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-pink-light hover:text-pink-dark"
                  >
                    Vidi
                  </Link>
                  <ActionButton
                    action={adminDeleteProduct.bind(null, p.id)}
                    confirm={`Obrisati proizvod „${p.name}"?`}
                    icon="trash"
                    variant="outline"
                    success="Proizvod obrisan."
                  >
                    Obriši
                  </ActionButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
