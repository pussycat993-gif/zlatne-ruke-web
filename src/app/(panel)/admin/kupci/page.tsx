import type { Metadata } from "next";
import { clerkClient } from "@clerk/nextjs/server";
import { Kpi } from "@/components/panel/kpi";

export const metadata: Metadata = { title: "Kupci — Admin" };

export default async function AdminBuyersPage() {
  let total = 0;
  try {
    const client = await clerkClient();
    total = await client.users.getCount();
  } catch {
    total = 0;
  }

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-semibold text-foreground md:text-3xl">
        Kupci
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <Kpi label="Registrovanih naloga" value={String(total)} />
      </div>

      <p className="mt-6 rounded-2xl border border-line-soft bg-surface px-5 py-4 text-sm text-ink">
        Broj naloga dolazi direktno iz Clerk-a. Detaljniji uvid (aktivnost,
        praćenja) biće dostupan kad uvedemo analitiku.
      </p>
    </div>
  );
}
