import { SiteNav } from "@/components/site/site-nav";
import Footer from "@/components/Footer";
import { getCategories } from "@/lib/db/queries";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { getCurrentRole } from "@/lib/auth";

// Layout za javni deo sajta (naslovna, katalog, proizvod, radnja, magazin…).
// Auth i paneli (prodavac/admin) dobijaju svoje layout-e u zasebnim grupama.
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, notifCount, role] = await Promise.all([
    getCategories(),
    getUnreadNotificationCount(),
    getCurrentRole(),
  ]);

  return (
    <>
      <SiteNav
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        notifCount={notifCount}
        isAdmin={role === "admin"}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
