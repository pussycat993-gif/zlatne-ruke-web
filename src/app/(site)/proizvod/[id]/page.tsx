import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Show } from "@clerk/nextjs";
import { Icon } from "@/components/icon";
import { ContactSellerButton } from "@/components/site/contact-seller-button";
import { ReviewForm } from "@/components/site/review-form";
import { Crumbs } from "@/components/site/crumbs";
import { ProductCard } from "@/components/site/product-card";
import { ProductGallery } from "@/components/site/product-gallery";
import { FavButton } from "@/components/site/fav-button";
import { formatPrice, toneClass } from "@/lib/data";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { SITE_URL } from "@/lib/site";
import {
  getAllProducts,
  getProductById,
  getShopById,
  getProductReviews,
  getShopNameMap,
} from "@/lib/db/queries";
import { getFavoriteProductIds } from "@/lib/user-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  return {
    title: product
      ? `${product.name} — Zlatne Ruke`
      : "Proizvod — Zlatne Ruke",
    description: product?.desc,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const [shop, productReviews, allProducts, shopNames, favIds] =
    await Promise.all([
      getShopById(product.shopId),
      getProductReviews(product.id),
      getAllProducts(),
      getShopNameMap(),
      getFavoriteProductIds(),
    ]);
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  const productImages = product.imagePublicIds?.length
    ? product.imagePublicIds
    : product.imagePublicId
      ? [product.imagePublicId]
      : [];

  // JSON-LD (Product) za Google rich results.
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.desc,
    ...(productImages.length
      ? { image: productImages.map((id) => cloudinaryUrl(id, { width: 1200 })) }
      : {}),
    ...(shop ? { brand: { "@type": "Brand", name: shop.name } } : {}),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "RSD",
      availability:
        product.inStock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/proizvod/${product.id}`,
    },
    ...(product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Crumbs
        items={[
          { label: "Početna", href: "/" },
          { label: "Katalog", href: "/katalog" },
          { label: product.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery tone={product.tone} images={productImages} />

        <div>
          {/* Kartica radnje */}
          {shop && (
            <Link
              href={`/radnja/${shop.id}`}
              className="mb-5 flex items-center gap-3 rounded-2xl bg-cream p-3 transition-colors hover:bg-pink-light"
            >
              <div className={`size-10 shrink-0 rounded-xl ${toneClass[shop.tone]}`} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-pink-dark">
                  {shop.name}
                </div>
                <div className="truncate text-xs text-ink">
                  {shop.city} · ★ {shop.rating} · {shop.followers} prati
                </div>
              </div>
              <span className="shrink-0 text-sm font-semibold text-pink">
                Poseti →
              </span>
            </Link>
          )}

          <h1 className="text-balance font-heading text-3xl font-semibold leading-tight text-foreground md:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink">
            <span className="flex items-center gap-1">
              <Icon name="star" size={15} filled className="text-pink" />
              {product.rating} ({product.reviewCount} recenzija)
            </span>
            <span className="text-ink-soft">·</span>
            <span>
              {product.inStock <= 3
                ? `Još samo ${product.inStock} na stanju`
                : `Na stanju: ${product.inStock}`}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-bold text-pink-dark">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <>
                <span className="text-lg text-ink-soft line-through">
                  {formatPrice(product.oldPrice)}
                </span>
                <span className="rounded-full bg-pink-light px-2.5 py-1 text-xs font-bold text-pink-dark">
                  −{discount}%
                </span>
              </>
            )}
          </div>

          <p className="mt-6 text-pretty leading-relaxed text-ink">
            {product.desc}
          </p>

          {/* Akcije — v1: kontakt sa prodavcem, bez korpe */}
          <div className="mt-8 flex items-stretch gap-3">
            {shop ? (
              <ContactSellerButton
                shopId={shop.id}
                className="h-12 flex-1 rounded-full text-sm"
              >
                Pošalji upit majstorici
              </ContactSellerButton>
            ) : (
              <span className="flex-1" />
            )}
            <div className="flex size-12 items-center justify-center rounded-full border border-line">
              <FavButton
                productId={product.id}
                initialFavorited={favIds.has(product.id)}
                className="shadow-none"
              />
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-ink-soft">
            Plaćanje i dostavu dogovaraš direktno sa majstoricom.
          </p>

          {/* Mini bedževi */}
          <div className="mt-7 grid grid-cols-3 gap-3">
            <Badge icon="flower" t="Ručno" d="rađeno" />
            <Badge icon="location" t="Lokalno" d="iz Srbije" />
            <Badge icon="package" t="Male" d="serije" />
          </div>
        </div>
      </div>

      {/* Opis & detalji */}
      <section className="mt-16 border-t border-line-soft pt-12">
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          Opis & detalji
        </h2>
        <div className="mt-6 grid gap-10 md:grid-cols-[2fr_1fr]">
          <div className="space-y-4 leading-relaxed text-ink">
            <p>{product.desc}</p>
            <p>
              Svaki komad nastaje u ateljeu majstorice. Male serije, ručno
              rađeno, ne ponavlja se. Materijali su lokalnog porekla, gde je god
              to moguće.
            </p>
          </div>
          <dl className="space-y-0">
            <DetailRow l="Kategorija" v={product.category} />
            <DetailRow l="Radnja" v={shop?.name ?? "—"} />
            <DetailRow l="Poreklo" v={shop?.city ?? "Srbija"} />
            <DetailRow l="Na stanju" v={`${product.inStock} kom`} />
          </dl>
        </div>
      </section>

      {/* Recenzije */}
      <section className="mt-16 border-t border-line-soft pt-12">
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          Recenzije ({product.reviewCount})
        </h2>
        <div className="mt-6 grid gap-10 md:grid-cols-[1fr_2fr]">
          <div>
            <div className="text-6xl font-bold leading-none text-pink-dark">
              {product.rating}
            </div>
            <div className="mt-2 flex gap-0.5 text-pink">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon
                  key={i}
                  name="star"
                  size={18}
                  filled={i < Math.round(product.rating)}
                />
              ))}
            </div>
            <div className="mt-2 text-sm text-ink">
              {product.reviewCount} recenzija
            </div>
          </div>
          <div className="space-y-4">
            {productReviews.length > 0 ? (
              productReviews.map((r) => (
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
              ))
            ) : (
              <p className="text-ink">
                Još uvek nema recenzija za ovaj proizvod.
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 md:max-w-2xl">
          <Show when="signed-in">
            <ReviewForm productId={product.id} />
          </Show>
          <Show when="signed-out">
            <p className="rounded-2xl bg-cream px-5 py-4 text-sm text-ink">
              <Link
                href="/login"
                className="font-semibold text-pink hover:text-pink-dark"
              >
                Prijavi se
              </Link>{" "}
              da napišeš recenziju.
            </p>
          </Show>
        </div>
      </section>

      {/* Povezani proizvodi */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-line-soft pt-12">
          <h2 className="mb-8 font-heading text-2xl font-semibold text-foreground">
            Možda ti se svidi i
          </h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                shopName={shopNames.get(p.shopId)}
                favorited={favIds.has(p.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Badge({
  icon,
  t,
  d,
}: {
  icon: React.ComponentProps<typeof Icon>["name"];
  t: string;
  d: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-cream p-3">
      <span className="text-pink-dark">
        <Icon name={icon} size={20} />
      </span>
      <div className="leading-tight">
        <div className="text-xs font-bold text-pink-dark">{t}</div>
        <div className="text-xs text-ink">{d}</div>
      </div>
    </div>
  );
}

function DetailRow({ l, v }: { l: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-line-soft py-2.5 text-sm">
      <dt className="text-ink">{l}</dt>
      <dd className="font-semibold capitalize text-pink-dark">{v}</dd>
    </div>
  );
}
