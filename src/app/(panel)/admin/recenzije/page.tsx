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
      <h1 className="mb-2 font-heading text-2xl font-semibold text-foreground md:text-3xl">
        Recenzije
      </h1>
      <p className="mb-6 text-sm text-ink">
        Pregled svih recenzija na platformi ({reviews.length}).
      </p>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="flex gap-4 rounded-2xl border border-line-soft bg-surface p-5"
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
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-sm text-ink">Još nema recenzija.</p>
        )}
      </div>
    </div>
  );
}
