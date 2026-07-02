"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Blob } from "./blob";
import { ActionButton } from "./action-button";
import { adminDeleteShop } from "@/lib/admin-actions";
import type { AdminShop } from "@/lib/db/admin";
import { foldDiacritics } from "@/lib/normalize";
import { cn } from "@/lib/utils";

const FILTERS: [string, string][] = [
  ["sve", "Sve"],
  ["aktivna", "Aktivne"],
  ["demo", "Demo"],
];

// Opcije sortiranja. "default" = zadržava dolazni redosled (po pratiocima).
type SortKey =
  | "default"
  | "products-desc"
  | "products-asc"
  | "rating-desc"
  | "name-asc";

const SORTS: [SortKey, string][] = [
  ["default", "Podrazumevano"],
  ["products-desc", "Najviše proizvoda"],
  ["products-asc", "Najmanje proizvoda"],
  ["rating-desc", "Najbolja ocena"],
  ["name-asc", "Naziv (A–Š)"],
];

export function ShopsTable({ shops }: { shops: AdminShop[] }) {
  const [filter, setFilter] = useState("sve");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("default");

  // Pretraga + pill filter + sortiranje, sve nad već učitanom listom.
  const list = useMemo(() => {
    const q = foldDiacritics(query.trim());

    let rows = shops.filter((s) => {
      // 1) pill filter (Sve / Aktivne / Demo)
      if (filter !== "sve" && s.status !== filter) return false;
      // 2) pretraga po nazivu, vlasnici i gradu (bez kvačica)
      if (!q) return true;
      const haystack = foldDiacritics(`${s.name} ${s.owner} ${s.city}`);
      return haystack.includes(q);
    });

    // 3) sortiranje (posle filtera); kopija da ne menjamo prop.
    if (sort !== "default") {
      rows = [...rows].sort((a, b) => {
        switch (sort) {
          case "products-desc":
            return b.products - a.products;
          case "products-asc":
            return a.products - b.products;
          case "rating-desc":
            return b.rating - a.rating;
          case "name-asc":
            return a.name.localeCompare(b.name, "sr");
          default:
            return 0;
        }
      });
    }

    return rows;
  }, [shops, filter, query, sort]);

  return (
    <>
      {/* Pretraga + sortiranje (slažu se vertikalno na mobilnom) */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:flex-1">
          <Icon
            name="search"
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pretraži radnje"
            className="w-full rounded-full border border-line bg-surface py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-ink-soft focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/30"
          />
        </div>

        <label className="sr-only" htmlFor="shops-sort">
          Sortiranje radnji
        </label>
        <select
          id="shops-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="w-full rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink focus:border-pink focus:outline-none focus:ring-2 focus:ring-pink/30 sm:w-auto"
        >
          {SORTS.map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Pill filteri (Sve / Aktivne / Demo) */}
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              filter === key
                ? "bg-pink text-primary-foreground"
                : "border border-line text-ink hover:bg-pink-light",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface">
        <div className="hidden grid-cols-[auto_1.4fr_1fr_auto_auto_auto] items-center gap-4 border-b border-line-soft bg-cream px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wide text-ink md:grid">
          <span className="w-9" />
          <span>Radnja</span>
          <span>Vlasnica</span>
          <span className="text-right">Proizvodi</span>
          <span className="text-center">Status</span>
          <span className="text-right">Akcija</span>
        </div>

        {list.map((s) => (
          <div
            key={s.id}
            onClick={() =>
              window.open(`/radnja/${s.id}`, "_blank", "noopener,noreferrer")
            }
            className="flex cursor-pointer flex-wrap items-center gap-4 border-b border-line-soft px-5 py-3 transition-colors last:border-0 hover:bg-pink-light/50 md:grid md:grid-cols-[auto_1.4fr_1fr_auto_auto_auto]"
          >
            <Blob size={36} seed={s.name.length} initial={s.name[0]} />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-pink-dark">
                {s.name}
              </div>
              <div className="text-xs text-ink">
                {s.city} · ★ {s.rating.toFixed(1)}
              </div>
            </div>
            <div className="text-sm text-ink">{s.owner}</div>
            <div className="flex items-center gap-2 text-sm text-ink md:justify-end">
              <span>{s.products}</span>
              {s.products === 0 && (
                <span className="rounded-full bg-cream-deep px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-ink-soft">
                  prazna
                </span>
              )}
            </div>
            <div className="md:text-center">
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-bold",
                  s.status === "aktivna"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700",
                )}
              >
                {s.status}
              </span>
            </div>
            {/* Akcije: stopPropagation da klik na Detalji/Obriši NE otvori red */}
            <div
              className="flex justify-end gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                href={`/radnja/${s.id}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-pink-light hover:text-pink-dark"
              >
                Detalji
              </Link>
              <ActionButton
                action={() => adminDeleteShop(s.id)}
                confirm={`Obrisati radnju „${s.name}" i sve njene proizvode? Ovo se ne može poništiti.`}
                icon="trash"
                variant="outline"
                success="Radnja obrisana."
              >
                Obriši
              </ActionButton>
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-ink">
            Nema radnji koje odgovaraju pretrazi.
          </p>
        )}
      </div>
    </>
  );
}
