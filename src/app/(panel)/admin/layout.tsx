import Link from "next/link";
import { Icon } from "@/components/icon";
import { PanelNav, type PanelNavItem } from "@/components/panel/panel-nav";
import { requireRole } from "@/lib/auth";

const ADMIN_NAV: PanelNavItem[] = [
  { href: "/admin", label: "Pregled", icon: "home" },
  { href: "/admin/radnje", label: "Radnje", icon: "package" },
  { href: "/admin/proizvodi", label: "Proizvodi", icon: "grid" },
  { href: "/admin/recenzije", label: "Recenzije", icon: "star" },
  { href: "/admin/kupci", label: "Kupci", icon: "user" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["admin"]);

  return (
    <div className="flex min-h-full flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between gap-4 bg-[#1f1318] px-4 py-3 text-white md:px-6">
        <div className="font-mono text-xs uppercase tracking-[0.14em] text-white/80">
          Admin panel · Zlatne Ruke
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10"
        >
          <Icon name="back" size={15} /> Nazad na sajt
        </Link>
      </header>

      <div className="grid flex-1 lg:grid-cols-[240px_1fr]">
        {/* Sidebar (tamna) */}
        <aside className="bg-[#1f1318] px-4 pb-6 pt-2 lg:pt-6">
          <PanelNav items={ADMIN_NAV} tone="dark" />
        </aside>

        <main className="min-w-0 bg-cream px-4 py-8 md:px-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
