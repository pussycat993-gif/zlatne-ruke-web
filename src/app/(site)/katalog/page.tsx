import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { Crumbs } from "@/components/site/crumbs";
import { ProductCard } from "@/components/site/product-card";
import { SortSelect } from "@/components/site/sort-select";
import { CatalogFilters } from "@/components/site/catalog-filters";
import { Icon } from "@/components/icon";
import {
  getCategories,
  searchProducts,
  getShopNameMap,
  getShopCities,
} from "@/lib/db/queries";
import { getFavoriteProductIds } from "@/lib/user-data";

export const metadata: Metadata = {
  title: "Katalog — Zlatne Ruke",
  description: "Pretraži rukotvorine žena iz Srbije po kategorijama.",
};

type Search = {
  cat?: string;
  q?: string;
  sort?: string;
  city?: string;
  min?: string;
  max?: string;
  page?: string;
};

// Gradi URL čuvajući zadate parametre (prazne izostavlja).
function buildHref(params: {
  cat?: string;
  q?: string;
  sort?: string;
  city?: string;
  min?: string;
  max?: string;
  page?: number;
}) {
  const sp = new URLSearchParams();
  if (params.cat) sp.set("cat", params.cat);
  if (params.q) sp.set("q", params.q);
  if (params.sort && params.sort !== "najnovije") sp.set("sort", params.sort);
  if (params.city) sp.set("city", params.city);
  if (params.min) sp.set("min", params.min);
  if (params.max) sp.set("max", params.max);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  const qs = sp.toString();
  return qs ? `/katalog?${qs}` : "/katalog";
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const cat = sp.cat;
  const q = sp.q?.trim();
  const sort = sp.sort ?? "najnovije";
  const city = sp.city;
  const min = sp.min;
  const max = sp.max;
  const pageNum = Math.max(1, Number(sp.page) || 1);

  const [categories, shopNames, favIds, cities] = await Promise.all([
    getCategories(),
    getShopNameMap(),
    getFavoriteProductIds(),
    getShopCities(),
  ]);
  const activeCat = categories.find((c) => c.id === cat);
  const { items, total, page, totalPages } = await searchProducts({
    cat,
    q,
    sort,
    city,
    minPrice: min ? Number(min) : undefined,
    maxPrice: max ? Number(max) : undefined,
    page: pageNum,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
      <Crumbs
        items={[
          { label: "Početna", href: "/" },
          { label: "Katalog", href: activeCat || q ? "/katalog" : undefined },
          ...(activeCat ? [{ label: activeCat.name }] : []),
        ]}
      />

      <header className="mb-8">
        <h1 className="font-heading text-4xl font-semibold text-foreground md:text-5xl">
          {activeCat ? activeCat.name : "Katalog"}
        </h1>
        <p className="mt-3 text-sm text-ink md:text-base">
          {q ? (
            <>
              Rezultati za{" "}
              <span className="font-semibold text-pink-dark">„{q}"</span> ·{" "}
            </>
          ) : null}
          {total} {total === 1 ? "proizvod" : "proizvoda"}
        </p>
      </header>

      {/* Čipovi kategorija */}
      <div className="mb-6 flex flex-wrap gap-2">
        <CategoryChip
          href={buildHref({ q, sort, city, min, max })}
          active={!cat}
          label="Sve"
        />
        {categories.map((c) => (
          <CategoryChip
            key={c.id}
            href={buildHref({ cat: c.id, q, sort, city, min, max })}
            active={cat === c.id}
            label={c.name}
          />
        ))}
      </div>

      {/* Filteri + sortiranje */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <CatalogFilters cities={cities} city={city} min={min} max={max} />
        <SortSelect value={sort} />
      </div>

      {items.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                shopName={shopNames.get(p.shopId)}
                favorited={favIds.has(p.id)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-3">
              <PageLink
                href={buildHref({ cat, q, sort, city, min, max, page: page - 1 })}
                disabled={page <= 1}
              >
                <Icon name="back" size={16} /> Prethodna
              </PageLink>
              <span className="font-mono text-sm text-ink">
                {page} / {totalPages}
              </span>
              <PageLink
                href={buildHref({ cat, q, sort, city, min, max, page: page + 1 })}
                disabled={page >= totalPages}
              >
                Sledeća <Icon name="forward" size={16} />
              </PageLink>
            </nav>
          )}
        </>
      ) : (
        <div className="rounded-3xl border border-line-soft bg-cream px-6 py-20 text-center">
          <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-surface text-pink">
            <Icon name="search" size={26} />
          </span>
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Nema rezultata
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink">
            Probaj drugu kategoriju ili pojam pretrage.
          </p>
          <Button asChild size="default" className="mt-6">
            <Link href="/katalog">Prikaži sve proizvode</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function CategoryChip({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        active
          ? "border-pink bg-pink text-primary-foreground"
          : "border-line bg-surface text-ink hover:border-pink hover:text-pink-dark",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

function PageLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const cls =
    "inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-semibold";
  if (disabled) {
    return (
      <span className={`${cls} cursor-not-allowed text-ink-soft opacity-50`}>
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={`${cls} text-pink-dark transition-colors hover:border-pink hover:bg-pink-light`}
    >
      {children}
    </Link>
  );
}
