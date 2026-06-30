import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { PageHead } from "@/components/admin/page-head";
import { Blob } from "@/components/admin/blob";
import { EmptyState } from "@/components/admin/empty-state";
import { ActionButton } from "@/components/admin/action-button";
import { adminDeleteReview } from "@/lib/admin-actions";
import { getAdminReviews } from "@/lib/db/admin";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Recenzije — Admin" };

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews();

  return (
    <>
      <PageHead eyebrow="Moderacija" title="Recenzije" />

      {reviews.length === 0 ? (
        <EmptyState
          title="Nema recenzija"
          text="Kad kupci ostave recenzije, pojaviće se ovde."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface">
          {reviews.map((r, i) => (
            <article
              key={r.id}
              className={cn(
                "flex flex-wrap gap-4 px-5 py-4",
                i > 0 && "border-t border-line-soft",
                r.flagged && "bg-amber-50/50",
              )}
            >
              <Blob size={42} seed={r.author.length} initial={r.author[0]} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-bold text-pink-dark">
                    {r.author}
                  </span>
                  <span className="text-xs text-ink">{r.date}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="flex gap-0.5 text-pink">
                    {Array.from({ length: r.rating }).map((_, k) => (
                      <Icon key={k} name="star" size={13} filled />
                    ))}
                  </span>
                  <span className="text-xs text-ink">· {r.shopName}</span>
                  {r.flagged && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                      prijavljeno
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink">{r.text}</p>
              </div>
              <div className="flex shrink-0 items-start">
                <ActionButton
                  action={() => adminDeleteReview(r.id)}
                  confirm="Obrisati ovu recenziju?"
                  icon="trash"
                  variant="outline"
                  success="Recenzija obrisana."
                >
                  Obriši
                </ActionButton>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
