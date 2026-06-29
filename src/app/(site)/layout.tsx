import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { getCategories } from "@/lib/db/queries";

// Layout za javni deo sajta (naslovna, katalog, proizvod, radnja, magazin…).
// Auth i paneli (prodavac/admin) dobijaju svoje layout-e u zasebnim grupama.
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();

  return (
    <>
      <SiteNav
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
