"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CatalogFilters({
  cities,
  city,
  min,
  max,
}: {
  cities: string[];
  city?: string;
  min?: string;
  max?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const hasFilters = Boolean(city || min || max);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next = new URLSearchParams(params.toString());
    for (const key of ["city", "min", "max"] as const) {
      const v = String(fd.get(key) ?? "").trim();
      if (v) next.set(key, v);
      else next.delete(key);
    }
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
  }

  function reset() {
    const next = new URLSearchParams(params.toString());
    ["city", "min", "max", "page"].forEach((k) => next.delete(k));
    router.push(`${pathname}?${next.toString()}`);
  }

  const ctrl =
    "rounded-full border border-line bg-surface px-4 py-2 text-sm text-pink-dark outline-none focus:border-pink";

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-center gap-2">
      <select name="city" defaultValue={city ?? ""} className={ctrl}>
        <option value="">Sve gradove</option>
        {cities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <input
        name="min"
        type="number"
        min={0}
        defaultValue={min ?? ""}
        placeholder="Cena od"
        className={`${ctrl} w-28`}
      />
      <input
        name="max"
        type="number"
        min={0}
        defaultValue={max ?? ""}
        placeholder="do"
        className={`${ctrl} w-24`}
      />
      <Button type="submit" size="compact">
        Primeni
      </Button>
      {hasFilters && (
        <Button type="button" variant="outline" size="compact" onClick={reset}>
          Poništi
        </Button>
      )}
    </form>
  );
}
