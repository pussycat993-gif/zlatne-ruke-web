import { SiteNav } from "@/components/site/site-nav";
import Footer from "@/components/Footer";
import { getCategories } from "@/lib/db/queries";
import { getUnreadNotificationCount } from "@/lib/notifications";

// Layout za javni deo sajta (naslovna, katalog, proizvod, radnja, magazin…).
// Auth i paneli (prodavac/admin) dobijaju svoje layout-e u zasebnim grupama.
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, notifCount] = await Promise.all([
    getCategories(),
    getUnreadNotificationCount(),
  ]);

  return (
    <>
      <SiteNav
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        notifCount={notifCount}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
