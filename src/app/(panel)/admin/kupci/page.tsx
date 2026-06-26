import type { Metadata } from "next";
import { Kpi } from "@/components/panel/kpi";

export const metadata: Metadata = { title: "Kupci — Admin" };

export default function AdminBuyersPage() {
  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-semibold text-foreground md:text-3xl">
        Kupci
      </h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Kpi label="Registrovanih" value="14.230" delta="+340 ovaj mesec" />
        <Kpi label="Aktivnih (30 dana)" value="3.420" />
        <Kpi label="Prati bar 1 radnju" value="61%" />
      </div>

      <p className="mt-6 rounded-2xl border border-line-soft bg-surface px-5 py-4 text-sm text-ink">
        Detaljan spisak kupaca i njihovih aktivnosti biće dostupan kada povežemo
        bazu i naloge (Clerk).
      </p>
    </div>
  );
}
