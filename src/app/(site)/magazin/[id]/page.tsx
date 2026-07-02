import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Crumbs } from "@/components/site/crumbs";
import { ProductCard } from "@/components/site/product-card";
import { toneClass } from "@/lib/data";
import {
  getStoryById,
  getShopById,
  getShopProducts,
} from "@/lib/db/queries";
import { getFavoriteProductIds } from "@/lib/user-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const story = await getStoryById(id);
  return {
    title: story ? `${story.title} - Magazin` : "Priča - Zlatne Ruke",
    description: story?.excerpt,
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = await getStoryById(id);
  if (!story) notFound();

  const shop = await getShopById(story.shopId);
  const [shopProducts, favIds] = await Promise.all([
    shop ? getShopProducts(shop.id) : Promise.resolve([]),
    getFavoriteProductIds(),
  ]);
  const featuredProducts = shopProducts.slice(0, 4);

  return (
    <article className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
      <Crumbs
        items={[
          { label: "Početna", href: "/" },
          { label: "Magazin", href: "/magazin" },
          { label: story.title },
        ]}
      />

      <header>
        <div className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink">
          Priča · {story.readTime} · {story.date}
        </div>
        <h1 className="mt-3 text-balance font-heading text-3xl font-semibold leading-tight text-foreground md:text-5xl">
          {story.title}
        </h1>
      </header>

      <div
        className={`mt-8 aspect-[16/9] w-full rounded-3xl shadow-[var(--zr-shadow)] ${toneClass[story.tone]}`}
      />

      <div className="mt-10 space-y-5 text-pretty text-lg leading-relaxed text-ink">
        <p className="text-xl font-medium text-pink-dark">{story.excerpt}</p>
        <p>
          Sve je počelo u maloj radionici, sa idejom da se rukama napravi nešto
          što traje. Iza svakog komada stoji sat, tri, ponekad i nekoliko dana
          pažljivog rada - i priča koja zaslužuje da se ispriča.
        </p>
        <p>
          Na Zlatnim Rukama svaka majstorica ima svoje mesto: ime, grad i
          predmete koje pravi. Veruje se da kupac treba da zna ko stoji iza
          onoga što kupuje.
        </p>
      </div>

      {shop && (
        <Link
          href={`/radnja/${shop.id}`}
          className="mt-12 flex items-center gap-4 rounded-2xl bg-cream p-5 transition-colors hover:bg-pink-light"
        >
          <div className={`size-14 shrink-0 rounded-xl ${toneClass[shop.tone]}`} />
          <div className="flex-1">
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-ink">
              Radnja iz priče
            </div>
            <div className="mt-1 font-bold text-pink-dark">{shop.name}</div>
            <div className="text-sm text-ink">
              {shop.owner} · {shop.city}
            </div>
          </div>
          <span className="text-sm font-semibold text-pink">Poseti →</span>
        </Link>
      )}

      {featuredProducts.length > 0 && (
        <section className="mt-14 border-t border-line-soft pt-10">
          <h2 className="mb-6 font-heading text-2xl font-semibold text-foreground">
            Iz ove radnje
          </h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {featuredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                shopName={shop?.name}
                favorited={favIds.has(p.id)}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
