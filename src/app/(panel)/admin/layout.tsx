import Link from "next/link";
import { Toaster } from "sonner";
import { Icon } from "@/components/icon";
import type { Metadata } from "next";
import { PanelNav, type PanelNavItem } from "@/components/panel/panel-nav";
import { requireRole } from "@/lib/auth";
import { getPendingTagCount, getFlaggedReviewCount } from "@/lib/db/admin";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["admin"]);

  const [pendingTags, flaggedReviews] = await Promise.all([
    getPendingTagCount(),
    getFlaggedReviewCount(),
  ]);

  const nav: PanelNavItem[] = [
    { href: "/admin", label: "Pregled", icon: "chart" },
    { href: "/admin/radnje", label: "Radnje", icon: "package" },
    { href: "/admin/proizvodi", label: "Proizvodi", icon: "grid" },
    { href: "/admin/kupci", label: "Kupci", icon: "user" },
    {
      href: "/admin/recenzije",
      label: "Recenzije",
      icon: "star",
      badge: flaggedReviews || undefined,
    },
    {
      href: "/admin/tagovi",
      label: "Tagovi",
      icon: "tag",
      badge: pendingTags || undefined,
    },
  ];

  return (
    <div className="flex min-h-full flex-col lg:grid lg:grid-cols-[248px_1fr]">
      {/* Sidebar (tamna) */}
      <aside className="flex flex-col bg-[#1f1318] px-4 py-4 lg:sticky lg:top-0 lg:h-screen lg:py-6">
        <div className="mb-5 flex items-center gap-2.5 border-b border-white/10 pb-4">
          <Icon name="flower" size={24} className="text-pink" strokeWidth={1.6} />
          <span className="font-script text-2xl leading-none text-white">
            Admin
          </span>
        </div>

        <div className="mb-2 px-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/40">
          Upravljanje
        </div>
        <PanelNav items={nav} tone="dark" />

        <Link
          href="/"
          className="mt-auto flex items-center gap-3 rounded-xl border-t border-white/10 px-3.5 pt-4 text-sm font-medium text-white/60 transition-colors hover:text-white"
        >
          <Icon name="back" size={16} /> Nazad na sajt
        </Link>
      </aside>

      {/* Main kolona */}
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line-soft bg-card px-4 py-3 md:px-8">
          <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink">
            Admin panel · Zlatne Ruke
          </span>
          <div className="flex items-center gap-3">
            <span className="relative inline-flex size-9 items-center justify-center rounded-full border border-line text-pink">
              <Icon name="bell" size={17} />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-pink" />
            </span>
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-pink-light text-sm font-bold text-pink-dark">
              A
            </span>
          </div>
        </header>

        <main className="min-w-0 flex-1 bg-cream px-4 py-8 md:px-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>

      <Toaster richColors position="top-center" />
    </div>
  );
}
