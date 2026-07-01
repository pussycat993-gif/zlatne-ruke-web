import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/icon";
import { FavButton } from "@/components/site/fav-button";
import { type Product, formatPrice, toneClass } from "@/lib/data";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

// Kartica proizvoda — placeholder „blob" slika (gradijent po tonu), naziv
// radnje, naziv, cena i ocena. Bez korpe (v1) — vodi na stranicu proizvoda.
// `shopName` se prosleđuje iz strane (izbegava DB upit po kartici).
export function ProductCard({
  product,
  shopName,
  favorited = false,
}: {
  product: Product;
  shopName?: string;
  favorited?: boolean;
}) {
  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;

  return (
    <article className="group relative">
      <FavButton
        productId={product.id}
        initialFavorited={favorited}
        className="absolute right-3 top-3 z-10"
      />
      <Link href={`/proizvod/${product.id}`} className="block">
        <div
          className={cn(
            "relative aspect-[5/6] w-full overflow-hidden rounded-2xl transition-transform duration-200 group-hover:-translate-y-1",
            toneClass[product.tone],
          )}
        >
          {product.imagePublicId && (
            <Image
              src={cloudinaryUrl(product.imagePublicId, { width: 500 })}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          )}
          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-pink-dark px-2.5 py-1 text-[0.7rem] font-bold text-white">
              −{discount}%
            </span>
          )}
          {product.inStock <= 3 && (
            <span className="absolute bottom-3 left-3 rounded-full bg-surface px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-pink-dark">
              još {product.inStock}
            </span>
          )}
        </div>
        <div className="mt-3">
          <div className="truncate text-2xl font-semibold leading-tight text-ink">
            {shopName}
          </div>
          <h3 className="mt-1 line-clamp-2 text-3xl font-semibold leading-tight text-pink-dark">
            {product.name}
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-bold text-pink-dark">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-ink-soft line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="ml-auto flex items-center gap-1 text-xs text-ink">
              <Icon name="star" size={13} filled className="text-pink" />
              {product.rating}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
