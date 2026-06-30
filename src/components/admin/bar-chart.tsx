// Jednostavan stubičasti grafikon (bez biblioteke). Poslednji stubić je istaknut.
export function BarChart({
  data,
}: {
  data: { label: string; count: number }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div>
      <div className="flex h-40 items-end gap-1.5">
        {data.map((d, i) => (
          <div
            key={i}
            title={`${d.label} — ${d.count}`}
            className="flex-1 rounded-t-md transition-[height] duration-300"
            style={{
              height: `${Math.max(4, (d.count / max) * 100)}%`,
              background: "var(--zr-pink)",
              opacity: i === data.length - 1 ? 1 : 0.32,
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[0.65rem] text-ink">
        <span>{data[0]?.label}</span>
        <span>{data[Math.floor(data.length / 2)]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}
