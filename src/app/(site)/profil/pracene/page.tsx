import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Crumbs } from "@/components/site/crumbs";
import { toneClass } from "@/lib/data";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { getFollowedShops } from "@/lib/user-data";

export const metadata: Metadata = {
  title: "Praćene radnje — Zlatne Ruke",
  robots: { index: false, follow: false },
};

export default async function FollowedShopsPage() {
  const shops = await getFollowedShops();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
      <Crumbs
        items={[
          { label: "Početna", href: "/" },
          { label: "Profil", href: "/profil" },
          { label: "Praćene radnje" },
        ]}
      />

      <h1 className="font-heading text-3xl font-semibold text-foreground md:text-4xl">
        Praćene radnje{" "}
        {shops.length > 0 && (
          <span className="text-lg font-medium text-ink">({shops.length})</span>
        )}
      </h1>

      {shops.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-line-soft bg-cream px-6 py-16 text-center">
          <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-surface text-pink">
            <Icon name="flower" size={26} />
          </span>
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Još ne pratiš nijednu radnju
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink">
            Na stranici radnje klikni „Prati radnju" da je sačuvaš ovde.
          </p>
          <Link
            href="/radnje"
            className="mt-6 inline-flex rounded-full bg-pink px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-pink-dark"
          >
            Pogledaj radnje
          </Link>
        </div>
      )}
    </div>
  );
}
