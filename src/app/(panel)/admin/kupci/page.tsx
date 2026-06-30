import type { Metadata } from "next";
import { clerkClient } from "@clerk/nextjs/server";
import { Kpi } from "@/components/panel/kpi";
import { PageHead } from "@/components/admin/page-head";
import { Blob } from "@/components/admin/blob";
import { getAdminBuyers } from "@/lib/db/admin";

export const metadata: Metadata = { title: "Kupci — Admin" };

export default async function AdminBuyersPage() {
  let registered = 0;
  try {
    const client = await clerkClient();
    registered = await client.users.getCount();
  } catch {
    registered = 0;
  }

  const b = await getAdminBuyers();

  return (
    <>
      <PageHead eyebrow="Korisnička baza" title="Kupci" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Registrovanih naloga" value={String(registered)} featured />
        <Kpi label="Ostavili recenziju" value={String(b.reviewers)} />
        <Kpi label="Praćenja radnji" value={String(b.followers)} />
        <Kpi label="Omiljeno (ukupno)" value={String(b.favorites)} />
      </div>

      <section className="mt-6 rounded-2xl border border-line-soft bg-surface p-6">
        <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">
          Najaktivniji kupci (po recenzijama)
        </h2>
        {b.topBuyers.length === 0 ? (
          <p className="text-sm text-ink">Još nema aktivnosti kupaca.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line-soft font-mono text-xs uppercase tracking-wide text-ink">
                  <th className="py-2 text-left font-semibold" />
                  <th className="py-2 text-left font-semibold">Ime</th>
                  <th className="py-2 text-right font-semibold">Recenzije</th>
                  <th className="py-2 text-right font-semibold">Poslednja</th>
                </tr>
              </thead>
              <tbody>
                {b.topBuyers.map((c) => (
                  <tr
                    key={c.name}
                    className="border-b border-line-soft last:border-0"
                  >
                    <td className="py-2.5">
                      <Blob size={34} seed={c.name.length} initial={c.name[0]} />
                    </td>
                    <td className="py-2.5 font-semibold text-pink-dark">
                      {c.name}
                    </td>
                    <td className="py-2.5 text-right text-ink">{c.reviews}</td>
                    <td className="py-2.5 text-right text-ink">{c.lastDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="mt-5 rounded-2xl border border-line-soft bg-surface px-5 py-4 text-sm text-ink">
        Broj naloga dolazi iz Clerk-a. Ostale metrike su izvedene iz aktivnosti
        na platformi (recenzije, praćenja, omiljeno) — bez podataka o kupovini,
        jer se prodaja dogovara van platforme.
      </p>
    </>
  );
}
