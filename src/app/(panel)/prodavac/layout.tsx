import Link from "next/link";
import { Logo } from "@/components/site/logo";
import { Icon } from "@/components/icon";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { PanelNav, type PanelNavItem } from "@/components/panel/panel-nav";
import { requireRole } from "@/lib/auth";
import { getOrCreateSellerShop } from "@/lib/seller";
import { getSellerUnreadCount } from "@/lib/messages";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: false } };

// Panel prodavca koristi „radnju u fokusu" (Mila) kao primer naloga dok ne
// uvedemo auth. Tada ćemo prikazivati radnju ulogovanog prodavca.
const SELLER_NAV: PanelNavItem[] = [
  { href: "/prodavac", label: "Pregled", icon: "home" },
  { href: "/prodavac/proizvodi", label: "Proizvodi", icon: "package" },
  { href: "/prodavac/dodaj", label: "Novi proizvod", icon: "plus" },
  { href: "/prodavac/poruke", label: "Poruke", icon: "chat" },
  { href: "/prodavac/statistika", label: "Statistika", icon: "chart" },
  { href: "/prodavac/radnja", label: "Profil radnje", icon: "edit" },
];

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["prodavac", "admin"], "/postani-prodavac");

  const [myShop, unread] = await Promise.all([
    getOrCreateSellerShop(),
    getSellerUnreadCount(),
  ]);
  const navItems: PanelNavItem[] = SELLER_NAV.map((item) =>
    item.href === "/prodavac/poruke" && unread > 0
      ? { ...item, badge: unread }
      : item,
  );

  return (
    <div className="flex min-h-full flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-50 flex items-center gap-4 border-b border-line-soft bg-surface px-4 py-3 md:px-6">
        <Logo />
        <span className="hidden font-mono text-xs uppercase tracking-wider text-ink sm:inline">
          Panel prodavca
        </span>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-semibold text-pink-dark transition-colors hover:bg-pink-light"
          >
            <Icon name="back" size={16} /> Nazad na sajt
          </Link>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-6 px-4 py-6 md:px-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="mb-4 px-2">
            <div className="font-mono text-xs uppercase tracking-wider text-ink">
              Radnja
            </div>
            <div className="mt-1 font-bold text-pink-dark">
              {myShop?.name ?? "Moja radnja"}
            </div>
          </div>
          <PanelNav items={navItems} />
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
