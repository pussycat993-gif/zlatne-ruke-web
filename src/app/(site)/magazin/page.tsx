import type { Metadata } from "next";
import { Crumbs } from "@/components/site/crumbs";
import { StoryCard } from "@/components/site/story-card";
import { getAllStories, getShopNameMap } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Magazin — Zlatne Ruke",
  description:
    "Priče iza ruku: posete radionicama, intervjui i recepti majstorica iz Srbije.",
};

export default async function MagazinPage() {
  const [stories, shopNames] = await Promise.all([
    getAllStories(),
    getShopNameMap(),
  ]);
  const [featured, ...rest] = stories;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
      <Crumbs items={[{ label: "Početna", href: "/" }, { label: "Magazin" }]} />

      <header className="mb-10">
        <h1 className="text-balance font-heading text-4xl font-semibold text-foreground md:text-5xl">
          Priče iza{" "}
          <span className="font-script font-normal text-pink">ruku.</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-ink md:text-base">
          Posete radionicama, intervjui, recepti. Sve što ne stane na karticu
          proizvoda.
        </p>
      </header>

      {featured && (
        <div className="mb-12 md:max-w-3xl">
          <StoryCard
            story={featured}
            shopName={shopNames.get(featured.shopId)}
            large
          />
        </div>
      )}

      {rest.length > 0 && (
        <div className="grid gap-8 md:grid-cols-3">
          {rest.map((s) => (
            <StoryCard
              key={s.id}
              story={s}
              shopName={shopNames.get(s.shopId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
