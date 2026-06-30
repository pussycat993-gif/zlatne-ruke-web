import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Kpi } from "@/components/panel/kpi";
import { PageHead } from "@/components/admin/page-head";
import { EmptyState } from "@/components/admin/empty-state";
import { ActionButton } from "@/components/admin/action-button";
import { approveTag, rejectTag } from "@/lib/admin-actions";
import { getPendingTags, getTagStats } from "@/lib/db/admin";

export const metadata: Metadata = { title: "Tagovi — Admin" };

export default async function AdminTagsPage() {
  const [pending, stats] = await Promise.all([getPendingTags(), getTagStats()]);

  return (
    <>
      <PageHead eyebrow="Moderacija" title="Tagovi —" accent="na čekanju" />

      <div className="grid grid-cols-3 gap-4">
        <Kpi label="Na čekanju" value={String(stats.pending)} featured />
        <Kpi label="Odobreno" value={String(stats.approved)} />
        <Kpi label="Odbijeno" value={String(stats.rejected)} />
      </div>

      {pending.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Nema tagova na čekanju"
            text="Sve je pregledano. Lepa pauza."
          />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {pending.map((t) => (
            <article
              key={t.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-line-soft bg-surface px-5 py-4"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-light px-3 py-1 text-sm font-semibold text-pink-dark">
                <Icon name="tag" size={13} /> {t.name}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm text-ink">
                  Grupa: <strong className="text-foreground">{t.groupLabel || "—"}</strong> ·
                  Predložila: <strong className="text-foreground">{t.proposedByName || "—"}</strong>
                </div>
                <div className="font-mono text-[0.62rem] uppercase tracking-wide text-ink">
                  {t.when}
                </div>
              </div>
              <div className="flex gap-2">
                <ActionButton
                  action={() => approveTag(t.id)}
                  icon="check"
                  variant="primary"
                  success="Tag odobren."
                >
                  Odobri
                </ActionButton>
                <ActionButton
                  action={() => rejectTag(t.id)}
                  icon="close"
                  variant="outline"
                  success="Tag odbijen."
                >
                  Odbij
                </ActionButton>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
