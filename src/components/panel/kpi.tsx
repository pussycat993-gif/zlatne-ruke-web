// Mala KPI kartica za panele.
export function Kpi({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: string;
}) {
  return (
    <div className="rounded-2xl border border-line-soft bg-surface p-5">
      <div className="font-mono text-xs font-semibold uppercase tracking-wide text-ink">
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold text-pink-dark">{value}</div>
      {delta && (
        <div className="mt-1 text-xs font-semibold text-pink">{delta}</div>
      )}
    </div>
  );
}
