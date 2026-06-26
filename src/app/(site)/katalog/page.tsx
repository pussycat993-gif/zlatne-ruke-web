import Link from "next/link";
import type { Metadata } from "next";
import { Crumbs } from "@/components/site/crumbs";
import { ProductCard } from "@/components/site/product-card";
import { Icon } from "@/components/icon";
import {
  getCategories,
  searchProducts,
  getShopNameMap,
} from "@/lib/db/queries";
import { getFavoriteProductIds } from "@/lib/user-data";

export const metadata: Metadata = {
  title: "Katalog — Zlatne Ruke",
  description: "Pretraži rukotvorine žena iz Srbije po kategorijama.",
};

type Search = { cat?: string; q?: string };

// Sastavlja href za čip kategorije, čuvajući aktivnu pretragu (q).
function chipHref(catId: string | null, q?: string) {
  const params = new URLSearchParams();
  if (catId) params.set("cat", catId);
  if (q) params.set("q", q);
  const qs = params.toString();
  return qs ? `/katalog?${qs}` : "/katalog";
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { cat, q } = await searchParams;
  const [categories, shopNames, favIds] = await Promise.all([
    getCategories(),
    getShopNameMap(),
    getFavoriteProductIds(),
  ]);
  const activeCat = categories.find((c) => c.id === cat);
  const filtered = await searchProducts({ cat, q: q?.trim() });

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
          {filtered.length}{" "}
          {filtered.length === 1 ? "proizvod" : "proizvoda"}
        </p>
      </header>

      {/* Čipovi kategorija */}
      <div className="mb-10 flex flex-wrap gap-2">
        <CategoryChip href={chipHref(null, q)} active={!cat} label="Sve" />
        {categories.map((c) => (
          <CategoryChip
            key={c.id}
            href={chipHref(c.id, q)}
            active={cat === c.id}
            label={c.name}
            icon={c.icon}
          />
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              shopName={shopNames.get(p.shopId)}
              favorited={favIds.has(p.id)}
            />
          ))}
        </div>
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
          <Link
            href="/katalog"
            className="mt-6 inline-flex rounded-full bg-pink px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-pink-dark"
          >
            Prikaži sve proizvode
          </Link>
        </div>
      )}
    </div>
  );
}

function CategoryChip({
  href,
  active,
  label,
  icon,
}: {
  href: string;
  active: boolean;
  label: string;
  icon?: React.ComponentProps<typeof Icon>["name"];
}) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        active
          ? "border-pink bg-pink text-primary-foreground"
          : "border-line bg-surface text-ink hover:border-pink hover:text-pink-dark",
      ].join(" ")}
    >
      {icon && <Icon name={icon} size={15} />}
      {label}
    </Link>
  );
}
