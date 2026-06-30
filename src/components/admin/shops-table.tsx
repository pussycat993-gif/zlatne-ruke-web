"use client";

import { useState } from "react";
import Link from "next/link";
import { Blob } from "./blob";
import { ActionButton } from "./action-button";
import { adminDeleteShop } from "@/lib/admin-actions";
import type { AdminShop } from "@/lib/db/admin";
import { cn } from "@/lib/utils";

const FILTERS: [string, string][] = [
  ["sve", "Sve"],
  ["aktivna", "Aktivne"],
  ["demo", "Demo"],
];

export function ShopsTable({ shops }: { shops: AdminShop[] }) {
  const [filter, setFilter] = useState("sve");
  const list = filter === "sve" ? shops : shops.filter((s) => s.status === filter);

  return (
    <>
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
            className="flex flex-wrap items-center gap-4 border-b border-line-soft px-5 py-3 last:border-0 md:grid md:grid-cols-[auto_1.4fr_1fr_auto_auto_auto]"
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
            <div className="text-sm text-ink md:text-right">
              {s.products}
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
            <div className="flex justify-end gap-2">
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
            Nema radnji u ovom filteru.
          </p>
        )}
      </div>
    </>
  );
}
