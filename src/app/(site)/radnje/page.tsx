import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Crumbs } from "@/components/site/crumbs";
import { toneClass } from "@/lib/data";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { getAllShops, getAllProducts } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Radnje — Zlatne Ruke",
  description: "Upoznaj majstorice iz cele Srbije i njihove radnje.",
};

export default async function ShopsPage() {
  const [shops, products] = await Promise.all([
    getAllShops(),
    getAllProducts(),
  ]);
  const productCounts = new Map<string, number>();
  for (const p of products) {
    productCounts.set(p.shopId, (productCounts.get(p.shopId) ?? 0) + 1);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
      <Crumbs items={[{ label: "Početna", href: "/" }, { label: "Radnje" }]} />

      <header className="mb-10">
        <h1 className="text-balance font-heading text-4xl font-semibold text-foreground md:text-5xl">
          Naše{" "}
          <span className="font-script font-normal text-pink">majstorice.</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-ink md:text-base">
          Svaka radnja je jedna žena, jedan grad i jedna priča.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shops.map((shop) => (
          <Link
            key={shop.id}
            href={`/radnja/${shop.id}`}
            className="group overflow-hidden rounded-3xl border border-line-soft bg-surface transition-all hover:-translate-y-1 hover:shadow-[var(--zr-shadow)]"
          >
            <div
              className={`relative aspect-[3/2] w-full overflow-hidden ${shop.coverPublicId ? "" : toneClass[shop.tone]}`}
            >
              {shop.coverPublicId && (
                <Image
                  src={cloudinaryUrl(shop.coverPublicId, { width: 600 })}
                  alt={shop.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-heading text-xl font-semibold text-foreground transition-colors group-hover:text-pink-dark">
                  {shop.name}
                </h2>
                <span className="flex items-center gap-1 text-sm text-ink">
                  <Icon name="star" size={14} filled className="text-pink" />
                  {shop.rating}
                </span>
              </div>
              <div className="mt-1 text-sm text-ink">
                {shop.owner} · {shop.city}
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink">
                {shop.bio}
              </p>
              <div className="mt-4 flex gap-4 font-mono text-xs text-ink-soft">
                <span>{productCounts.get(shop.id) ?? 0} proizvoda</span>
                <span>{shop.followers} prati</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
