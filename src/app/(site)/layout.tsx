import { SiteNav } from "@/components/site/site-nav";
import Footer from "@/components/Footer";
import { getCategories } from "@/lib/db/queries";
import { getUnreadNotificationCount } from "@/lib/notifications";
import { isCurrentUserAdmin } from "@/lib/is-admin";

// Layout za javni deo sajta (naslovna, katalog, proizvod, radnja, magazin…).
// Auth i paneli (prodavac/admin) dobijaju svoje layout-e u zasebnim grupama.
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // isAdmin se određuje po email-u (ADMIN_EMAILS), nezavisno od uloge — pa se
  // Admin link prikazuje i kad je korisnik ujedno prodavac.
  const [categories, notifCount, isAdmin] = await Promise.all([
    getCategories(),
    getUnreadNotificationCount(),
    isCurrentUserAdmin(),
  ]);

  return (
    <>
      <SiteNav
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        notifCount={notifCount}
        isAdmin={isAdmin}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
