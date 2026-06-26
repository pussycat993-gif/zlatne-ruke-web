"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const OPTIONS: [string, string][] = [
  ["najnovije", "Najnovije"],
  ["cena-rastuce", "Cena: rastuće"],
  ["cena-opadajuce", "Cena: opadajuće"],
  ["ocena", "Najbolje ocenjeno"],
];

export function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(params.toString());
    next.set("sort", e.target.value);
    next.delete("page"); // promena sortiranja vraća na prvu stranu
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <label className="flex items-center gap-2 text-sm text-ink">
      <span className="hidden sm:inline">Sortiraj:</span>
      <select
        value={value}
        onChange={onChange}
        className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-pink-dark outline-none focus:border-pink"
      >
        {OPTIONS.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}
