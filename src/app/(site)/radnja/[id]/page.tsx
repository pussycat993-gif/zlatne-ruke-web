import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Crumbs } from "@/components/site/crumbs";
import { ProductCard } from "@/components/site/product-card";
import { FollowButton } from "@/components/site/follow-button";
import { ContactSellerButton } from "@/components/site/contact-seller-button";
import { toneClass } from "@/lib/data";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { SITE_URL } from "@/lib/site";
import {
  getShopById,
  getShopProducts,
  getShopReviews,
} from "@/lib/db/queries";
import { getFavoriteProductIds, isFollowingShop } from "@/lib/user-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const shop = await getShopById(id);
  return {
    title: shop ? `${shop.name} — Zlatne Ruke` : "Radnja — Zlatne Ruke",
    description: shop?.bio,
  };
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shop = await getShopById(id);
  if (!shop) notFound();

  const [shopProducts, shopReviews, favIds, following] = await Promise.all([
    getShopProducts(shop.id),
    getShopReviews(shop.id),
    getFavoriteProductIds(),
    isFollowingShop(shop.id),
  ]);

  // JSON-LD (Store) za Google rich results.
  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: shop.name,
    ...(shop.bio ? { description: shop.bio } : {}),
    ...(shop.coverPublicId
      ? { image: cloudinaryUrl(shop.coverPublicId, { width: 1200 }) }
      : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: shop.city,
      addressCountry: "RS",
    },
    url: `${SITE_URL}/radnja/${shop.id}`,
    ...(shop.reviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: shop.rating,
            reviewCount: shop.reviews,
          },
        }
      : {}),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
      />
      {/* Hero pokrivač */}
      <div
        className={`relative h-48 w-full overflow-hidden md:h-64 ${shop.coverPublicId ? "" : toneClass[shop.tone]}`}
      >
        {shop.coverPublicId && (
          <Image
            src={cloudinaryUrl(shop.coverPublicId, { width: 1600 })}
            alt={`Naslovna slika — ${shop.name}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* Kartica radnje (preklapa hero) */}
        <div className="-mt-16 rounded-3xl bg-surface p-6 shadow-[var(--zr-shadow)] md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div
              className={`size-24 shrink-0 rounded-2xl border-4 border-surface shadow-[var(--zr-shadow-sm)] md:size-28 ${toneClass[shop.tone]}`}
            />
            <div className="flex-1">
              <div className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink">
                {shop.city}
              </div>
              <h1 className="mt-1 font-heading text-3xl font-semibold text-foreground md:text-4xl">
                {shop.name}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-ink">{shop.bio}</p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink">
                <span>
                  <strong className="text-pink-dark">★ {shop.rating}</strong> (
                  {shop.reviews} recenzija)
                </span>
                <span>
                  <strong className="text-pink-dark">{shop.followers}</strong>{" "}
                  prati
                </span>
                <span>
                  <strong className="text-pink-dark">
                    {shopProducts.length}
                  </strong>{" "}
                  proizvoda
                </span>
              </div>
            </div>
            <div className="flex shrink-0 gap-3 md:flex-col">
              <FollowButton
                shopId={shop.id}
                initialFollowing={following}
                className="flex-1 md:flex-none"
              />
              <ContactSellerButton
                shopId={shop.id}
                variant="outline"
                className="flex-1 rounded-full border-line text-sm text-pink-dark md:flex-none"
              >
                Poruka
              </ContactSellerButton>
            </div>
          </div>
        </div>

        <Crumbs
          items={[
            { label: "Početna", href: "/" },
            { label: "Radnje", href: "/radnje" },
            { label: shop.name },
          ]}
        />

        {/* Proizvodi */}
        <section className="mt-4 pb-4">
          <h2 className="mb-8 font-heading text-2xl font-semibold text-foreground">
            Proizvodi ({shopProducts.length})
          </h2>
          {shopProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {shopProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  shopName={shop.name}
                  favorited={favIds.has(p.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-ink">Ova radnja još nema objavljene proizvode.</p>
          )}
        </section>

        {/* O radnji */}
        <section className="mt-16 border-t border-line-soft pt-12">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-foreground">
                O{" "}
                <span className="font-script font-normal text-pink">
                  {shop.owner}
                </span>
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-ink">
                {shop.bio} Radim u gradu {shop.city}, gde sam i odrasla. Svaki
                predmet je rezultat sati pažnje — biraš ga znajući da iza njega
                stoji ime, a ne fabrika.
              </p>
            </div>
            <div className="rounded-2xl bg-cream p-6">
              <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">
                Brzi info
              </h3>
              <dl className="space-y-0">
                <ShopDetail l="Vlasnica" v={shop.owner} />
                <ShopDetail l="Lokacija" v={shop.city} />
                <ShopDetail l="Kategorija" v={shop.category} />
                <ShopDetail l="Ocena" v={`★ ${shop.rating}`} />
              </dl>
            </div>
          </div>
        </section>

        {/* Recenzije */}
        <section className="mb-20 mt-16 border-t border-line-soft pt-12">
          <h2 className="mb-8 font-heading text-2xl font-semibold text-foreground">
            Recenzije ({shop.reviews})
          </h2>
          {shopReviews.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {shopReviews.map((r) => (
                <div key={r.id} className="rounded-2xl bg-cream p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-pink-light font-semibold text-pink-dark">
                      {r.author[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-pink-dark">
                        {r.author}
                      </div>
                      <div className="text-xs text-ink">{r.date}</div>
                    </div>
                    <div className="ml-auto flex gap-0.5 text-pink">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Icon key={i} name="star" size={13} filled />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink">
                    {r.text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-ink">Ova radnja još nema recenzija.</p>
          )}
        </section>
      </div>
    </div>
  );
}

function ShopDetail({ l, v }: { l: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-line-soft py-2.5 text-sm last:border-0">
      <dt className="text-ink">{l}</dt>
      <dd className="font-semibold capitalize text-pink-dark">{v}</dd>
    </div>
  );
}
