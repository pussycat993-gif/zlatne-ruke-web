"use client";

import { useState } from "react";
import Image from "next/image";
import { type Tone, toneClass } from "@/lib/data";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

const VARIANTS: Tone[] = ["v2", "v3", "v4", "v5"];

// Galerija proizvoda. Ako proizvod ima sliku (Cloudinary), prikazuje nju;
// u suprotnom „blob" placeholder sa prebacivanjem tona.
export function ProductGallery({
  tone,
  imagePublicId,
}: {
  tone: Tone;
  imagePublicId?: string | null;
}) {
  const [active, setActive] = useState<Tone>(tone);

  if (imagePublicId) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl shadow-[var(--zr-shadow)]">
        <Image
          src={cloudinaryUrl(imagePublicId, { width: 1000 })}
          alt="Slika proizvoda"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div>
      <div
        className={cn(
          "aspect-square w-full rounded-3xl shadow-[var(--zr-shadow)]",
          toneClass[active],
        )}
      />
      <div className="mt-3 grid grid-cols-4 gap-3">
        {VARIANTS.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setActive(v)}
            aria-label={`Prikaži sliku ${v}`}
            className={cn(
              "aspect-square rounded-xl border-2 transition-colors",
              toneClass[v],
              active === v ? "border-pink" : "border-transparent",
            )}
          />
        ))}
      </div>
    </div>
  );
}
