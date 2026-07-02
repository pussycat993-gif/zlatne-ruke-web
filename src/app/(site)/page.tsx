import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { OtvoriRadnjuButton } from "@/components/ui/otvori-radnju-button";
import { Icon, type IconName } from "@/components/icon";
import { SectionHeader } from "@/components/site/section-header";
import { ProductCard } from "@/components/site/product-card";
import { StoryCard } from "@/components/site/story-card";
import { toneClass } from "@/lib/data";
import { cloudinaryUrl } from "@/lib/cloudinary";
import {
  getCategories,
  getAllProducts,
  getAllShops,
  getAllStories,
  getShopNameMap,
} from "@/lib/db/queries";
import {
  getFavoriteProductIds,
  getFollowedShopProducts,
} from "@/lib/user-data";

export default async function HomePage() {
  const [categories, products, shops, stories, shopNames, favIds, followedNew] =
    await Promise.all([
      getCategories(),
      getAllProducts(),
      getAllShops(),
      getAllStories(),
      getShopNameMap(),
      getFavoriteProductIds(),
      getFollowedShopProducts(4),
    ]);
  const featuredShop = shops[0];

  return (
    <>
      {/* ── Hero (editorial) ── */}
      <section className="bg-gradient-to-b from-cream to-cream-deep">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:px-8 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink">
              <Icon name="sparkle" size={14} className="text-pink" />
              Priča #12 · Maj 2026
            </div>
            <h1 className="text-balance font-heading text-5xl font-semibold leading-[0.98] tracking-tight text-foreground md:text-7xl">
              Šal koji Mila plete{" "}
              <span className="font-script font-normal text-pink">
                počinje pre zore.
              </span>
            </h1>
            <p className="mt-7 max-w-lg text-pretty text-base leading-relaxed text-ink md:text-lg">
              U ateljeu u Novom Sadu, Mila Petrović plete od 5 ujutru, dok grad
              još spava. Iza svakog komada - sat, tri, ponekad tri dana rada. Iza
              svakog komada - žena.
            </p>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button asChild size="cta">
                <Link href="/katalog">Istraži rukotvorine</Link>
              </Button>
              <Button asChild size="cta" variant="outline">
                <Link href="/magazin">Pročitaj priču</Link>
              </Button>
              {/* Jedinstveno animirano „Otvori radnju" dugme (shine + strelica) */}
              <OtvoriRadnjuButton href="/postani-prodavac" />
            </div>
            <div className="mt-12 flex gap-8 border-t border-line-soft pt-7">
              <Stat n="200+" l="majstorica" />
              <Stat n="38" l="gradova" />
              <Stat n="6.4k" l="zadovoljnih kupaca" />
            </div>
          </div>

          {/* Blob slika + plutajuće kartice */}
          <div className="relative">
            <div
              className={`aspect-[4/5] w-full rounded-[2rem] shadow-[var(--zr-shadow-lg)] ${toneClass.v2}`}
            />
            <div className="absolute -right-2 -top-4 flex size-24 rotate-6 flex-col items-center justify-center rounded-full bg-surface shadow-[var(--zr-shadow)]">
              <span className="font-script text-2xl leading-none text-pink-dark">
                ručno
              </span>
              <span className="font-script text-2xl leading-none text-pink">
                rađeno
              </span>
            </div>
            <Link
              href={`/radnja/${featuredShop.id}`}
              className="absolute inset-x-4 bottom-4 rounded-2xl bg-surface/95 p-4 shadow-[var(--zr-shadow-sm)] backdrop-blur"
            >
              <div className="font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-ink">
                U fokusu - radnja
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div
                  className={`size-11 shrink-0 rounded-xl ${toneClass[featuredShop.tone]}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-pink-dark">
                    {featuredShop.name}
                  </div>
                  <div className="truncate text-xs text-ink">
                    {featuredShop.city} · ★ {featuredShop.rating} ·{" "}
                    {featuredShop.reviews} recenzija
                  </div>
                </div>
                <span className="shrink-0 text-sm font-semibold text-pink">
                  Poseti →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Kategorije ── */}
      <section className="border-y border-line-soft bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeader
            eyebrow="Šta tražiš"
            title="Pretraži po vrsti"
            sub="Šest kategorija, na stotine majstorica."
            action={{ href: "/katalog", label: "Sve kategorije" }}
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/katalog?cat=${c.id}`}
                className="flex flex-col items-center rounded-2xl border border-transparent bg-cream p-5 text-center transition-all hover:-translate-y-1 hover:border-pink"
              >
                <span className="font-heading text-lg font-semibold text-pink-dark">
                  {c.name}
                </span>
                <span className="mt-1 text-xs text-ink">{c.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Novo od radnji koje pratiš (samo za ulogovane sa praćenjima) ── */}
      {followedNew.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeader
              eyebrow="Za tebe"
              title="Novo od radnji koje pratiš"
              action={{ href: "/profil/feed", label: "Vidi sve" }}
            />
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {followedNew.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  shopName={shopNames.get(p.shopId)}
                  favorited={favIds.has(p.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Istaknuti proizvodi ── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeader
            eyebrow="Novo & istaknuto"
            title="Predmeti koji nas dirnu"
            sub="Birano ručno, svake nedelje. Nema plaćenog promovisanja."
            action={{ href: "/katalog", label: "Pogledaj sve" }}
          />
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products.slice(0, 8).map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                shopName={shopNames.get(p.shopId)}
                favorited={favIds.has(p.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Istaknute radnje ── */}
      {shops.length > 0 && (
        <section className="border-y border-line-soft bg-surface py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeader
              eyebrow="Naše majstorice"
              title="Radnje u fokusu"
              sub="Iza svake radnje stoji jedna žena, jedan grad i jedna priča."
              action={{ href: "/radnje", label: "Sve radnje" }}
            />
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {shops.slice(0, 4).map((shop) => (
                <Link
                  key={shop.id}
                  href={`/radnja/${shop.id}`}
                  className="group overflow-hidden rounded-2xl border border-line-soft bg-card transition-all hover:-translate-y-1 hover:shadow-[var(--zr-shadow-sm)]"
                >
                  <div
                    className={`relative aspect-[3/2] w-full overflow-hidden ${shop.coverPublicId ? "" : toneClass[shop.tone]}`}
                  >
                    {shop.coverPublicId && (
                      <Image
                        src={cloudinaryUrl(shop.coverPublicId, { width: 500 })}
                        alt={shop.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="font-semibold text-pink-dark transition-colors group-hover:text-pink">
                      {shop.name}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-ink">
                      <Icon name="location" size={13} /> {shop.city} · ★{" "}
                      {shop.rating}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Manifest ── */}
      <section className="bg-pink-tint py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-8 lg:grid-cols-[1fr_1.2fr]">
          <div className={`aspect-[4/3] w-full rounded-3xl ${toneClass.v3}`} />
          <div>
            <div className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink">
              Naš manifest
            </div>
            <h2 className="text-balance font-heading text-4xl font-semibold leading-tight text-foreground md:text-5xl">
              Svaki predmet ima{" "}
              <span className="font-script font-normal text-pink">
                ime, mesto i priču.
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-ink">
              Ne pravimo ih mi, prave ih one - Mila iz Novog Sada, Ana iz
              Beograda, Jelena iz Niša. Sofija, Tijana, Vesna. Mi samo otvaramo
              vrata između njihovih ruku i tvog doma.
            </p>
            <div className="mt-9 grid gap-6 sm:grid-cols-2">
              <ManifestPoint
                icon="tag"
                t="0% provizije za prodavce"
                d="Prvih godinu dana."
              />
              <ManifestPoint
                icon="chat"
                t="Direktan kontakt"
                d="Pričaš sa majstoricom, ne sa botom."
              />
              <ManifestPoint
                icon="flower"
                t="Na srpskom, za Srbiju"
                d="Lokalna dostava, lokalna podrška."
              />
              <ManifestPoint
                icon="heart"
                t="Bez fast fashion-a"
                d="Male serije, prava kvaliteta."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Priče (magazin) ── */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeader
            eyebrow="Magazin"
            title="Priče iza ruku"
            sub="Posete radionicama, intervjui, recepti. Sve što ne stane na karticu proizvoda."
            action={{ href: "/magazin", label: "Sve priče" }}
          />
          <div className="grid gap-6 md:grid-cols-3">
            <StoryCard
              story={stories[0]}
              shopName={shopNames.get(stories[0].shopId)}
              large
            />
            <StoryCard
              story={stories[1]}
              shopName={shopNames.get(stories[1].shopId)}
            />
            <StoryCard
              story={stories[2]}
              shopName={shopNames.get(stories[2].shopId)}
            />
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Pomoćne komponente (samo za naslovnu) ── */

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="text-3xl font-bold leading-none text-pink-dark">{n}</div>
      <div className="mt-1.5 font-mono text-xs tracking-wide text-ink">{l}</div>
    </div>
  );
}

function ManifestPoint({ icon, t, d }: { icon: IconName; t: string; d: string }) {
  return (
    <div className="flex gap-3.5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface text-pink-dark">
        <Icon name={icon} size={20} />
      </span>
      <div>
        <div className="text-sm font-bold text-pink-dark">{t}</div>
        <div className="mt-0.5 text-xs text-ink">{d}</div>
      </div>
    </div>
  );
}
