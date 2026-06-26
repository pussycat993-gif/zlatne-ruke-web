import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { getAllReviews, getShopNameMap } from "@/lib/db/queries";

export const metadata: Metadata = { title: "Recenzije — Admin" };

export default async function AdminReviewsPage() {
  const [reviews, shopNames] = await Promise.all([
    getAllReviews(),
    getShopNameMap(),
  ]);

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-semibold text-foreground md:text-3xl">
        Recenzije & moderacija
      </h1>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="flex flex-col gap-4 rounded-2xl border border-line-soft bg-surface p-5 sm:flex-row"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-pink-light font-semibold text-pink-dark">
              {r.author[0]}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold text-pink-dark">
                  {r.author}
                </span>
                <span className="text-xs text-ink">
                  {shopNames.get(r.shopId)} · {r.date}
                </span>
              </div>
              <div className="mt-1 flex gap-0.5 text-pink">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Icon key={i} name="star" size={13} filled />
                ))}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink">{r.text}</p>
            </div>
            <div className="flex shrink-0 gap-2 sm:flex-col">
              <button
                type="button"
                className="rounded-full bg-pink-light px-4 py-2 text-xs font-semibold text-pink-dark transition-colors hover:bg-pink-tint"
              >
                Odobri
              </button>
              <button
                type="button"
                className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-pink-light"
              >
                Sakrij
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
