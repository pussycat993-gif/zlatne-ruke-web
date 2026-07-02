import type { Metadata } from "next";
import Link from "next/link";
import { Kpi } from "@/components/panel/kpi";
import { PageHead } from "@/components/admin/page-head";
import { BarChart } from "@/components/admin/bar-chart";
import { Blob } from "@/components/admin/blob";
import { getAdminOverview } from "@/lib/db/admin";

export const metadata: Metadata = { title: "Pregled - Admin" };

export default async function AdminOverviewPage() {
  const o = await getAdminOverview();

  return (
    <>
      <PageHead eyebrow="Pregled platforme" title="Platforma -" accent="pregled" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Aktivnih radnji" value={String(o.shopCount)} />
        <Kpi label="Proizvoda" value={String(o.productCount)} />
        <Kpi
          label="Pregledi proizvoda"
          value={o.totalViews.toLocaleString("sr-RS")}
          featured
        />
        <Kpi label="Recenzija" value={String(o.reviewCount)} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <section className="rounded-2xl border border-line-soft bg-surface p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Novi proizvodi po danu
            </h2>
            <span className="font-mono text-[0.65rem] uppercase tracking-wide text-ink">
              poslednje 2 nedelje
            </span>
          </div>
          <BarChart data={o.newProductsByDay} />
        </section>

        <section className="rounded-2xl border border-line-soft bg-surface p-6 lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Najnoviji proizvodi
            </h2>
            <Link
              href="/admin/proizvodi"
              className="text-xs font-semibold text-pink hover:text-pink-dark"
            >
              Svi →
            </Link>
          </div>
          <ul className="divide-y divide-line-soft">
            {o.recentProducts.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-3 first:pt-0">
                <Blob size={38} seed={p.name.length} initial={p.name[0]} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-pink-dark">
                    {p.name}
                  </div>
                  <div className="text-xs text-ink">
                    {p.shopName} · {p.when}
                  </div>
                </div>
              </li>
            ))}
            {o.recentProducts.length === 0 && (
              <li className="py-3 text-sm text-ink">Još nema proizvoda.</li>
            )}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-line-soft bg-surface p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">
          Top 5 radnji (po pratiocima)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line-soft font-mono text-xs uppercase tracking-wide text-ink">
                <th className="py-2 text-left font-semibold">#</th>
                <th className="py-2 text-left font-semibold">Radnja</th>
                <th className="py-2 text-left font-semibold">Grad</th>
                <th className="py-2 text-right font-semibold">Proizvodi</th>
                <th className="py-2 text-right font-semibold">Pratioci</th>
              </tr>
            </thead>
            <tbody>
              {o.topShops.map((s, i) => (
                <tr key={s.id} className="border-b border-line-soft last:border-0">
                  <td className="py-3">
                    <span className="inline-flex size-6 items-center justify-center rounded-full bg-pink-light text-xs font-bold text-pink-dark">
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-pink-dark">{s.name}</td>
                  <td className="py-3 text-ink">{s.city}</td>
                  <td className="py-3 text-right text-ink">{s.products}</td>
                  <td className="py-3 text-right font-bold text-pink">
                    {s.followers}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
