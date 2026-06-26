import type { Metadata } from "next";
import { Kpi } from "@/components/panel/kpi";

export const metadata: Metadata = { title: "Statistika — Panel prodavca" };

const BARS = [40, 65, 50, 78, 60, 92, 88, 70, 95, 110, 98, 130];
const DAYS = ["22.", "", "", "26.", "", "", "30.", "", "", "4.", "", "8."];

export default function SellerStatsPage() {
  const max = Math.max(...BARS);

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-semibold text-foreground md:text-3xl">
        Statistika
      </h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Kpi label="Pregledi (7 dana)" value="1.247" delta="+128" />
        <Kpi label="Posetioci → upit" value="3.8%" delta="+0.4 pp" />
        <Kpi label="Nove recenzije" value="12" delta="ocena ★ 4.9" />
      </div>

      <div className="mt-6 rounded-2xl border border-line-soft bg-surface p-6">
        <h2 className="mb-5 font-heading text-lg font-semibold text-foreground">
          Pregledi radnje — poslednje 2 nedelje
        </h2>
        <div className="flex h-56 items-end gap-2">
          {BARS.map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t-md ${i === BARS.length - 1 ? "bg-pink" : "bg-pink-light"}`}
              style={{ height: `${(h / max) * 100}%` }}
              title={`${h} pregleda`}
            />
          ))}
        </div>
        <div className="mt-2 flex gap-2 font-mono text-[0.65rem] text-ink-soft">
          {DAYS.map((d, i) => (
            <span key={i} className="flex-1 text-center">
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
