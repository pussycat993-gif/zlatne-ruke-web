import { cn } from "@/lib/utils";

// Mala KPI kartica za panele. `featured` istakne karticu (roze pozadina).
export function Kpi({
  label,
  value,
  delta,
  sub,
  suffix,
  featured = false,
}: {
  label: string;
  value: string;
  delta?: string;
  sub?: string;
  suffix?: string;
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        featured
          ? "border-transparent bg-pink text-primary-foreground shadow-[var(--zr-shadow-lg)]"
          : "border-line-soft bg-surface",
      )}
    >
      <div
        className={cn(
          "font-mono text-xs font-semibold uppercase tracking-wide",
          featured ? "text-primary-foreground/80" : "text-ink",
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          "mt-2 text-2xl font-bold",
          featured ? "text-primary-foreground" : "text-pink-dark",
        )}
      >
        {value}
        {suffix && <span className="ml-1 text-sm font-semibold">{suffix}</span>}
      </div>
      {delta && (
        <div
          className={cn(
            "mt-1 text-xs font-semibold",
            featured ? "text-primary-foreground/90" : "text-pink",
          )}
        >
          {delta}
          {sub && (
            <span
              className={cn(
                "ml-1 font-normal",
                featured ? "text-primary-foreground/70" : "text-ink",
              )}
            >
              {sub}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
