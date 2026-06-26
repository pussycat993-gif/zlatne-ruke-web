import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";

// Layout za javni deo sajta (naslovna, katalog, proizvod, radnja, magazin…).
// Auth i paneli (prodavac/admin) dobijaju svoje layout-e u zasebnim grupama.
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
