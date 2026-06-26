"use client";

import { useState } from "react";
import Image from "next/image";
import { type Tone, toneClass } from "@/lib/data";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

const VARIANTS: Tone[] = ["v2", "v3", "v4", "v5"];

// Galerija proizvoda. Ako proizvod ima slike (Cloudinary), prikazuje ih sa
// sličicama za prebacivanje; u suprotnom „blob" placeholder po tonu.
export function ProductGallery({
  tone,
  images = [],
}: {
  tone: Tone;
  images?: string[];
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [activeTone, setActiveTone] = useState<Tone>(tone);

  if (images.length > 0) {
    const safeIndex = Math.min(activeImg, images.length - 1);
    return (
      <div>
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl shadow-[var(--zr-shadow)]">
          <Image
            src={cloudinaryUrl(images[safeIndex], { width: 1000 })}
            alt="Slika proizvoda"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        {images.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {images.map((id, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImg(i)}
                aria-label={`Slika ${i + 1}`}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-xl border-2 transition-colors",
                  i === safeIndex ? "border-pink" : "border-transparent",
                )}
              >
                <Image
                  src={cloudinaryUrl(id, { width: 240 })}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Fallback: placeholder po tonu (kad proizvod nema slike).
  return (
    <div>
      <div
        className={cn(
          "aspect-square w-full rounded-3xl shadow-[var(--zr-shadow)]",
          toneClass[activeTone],
        )}
      />
      <div className="mt-3 grid grid-cols-4 gap-3">
        {VARIANTS.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setActiveTone(v)}
            aria-label={`Prikaži ${v}`}
            className={cn(
              "aspect-square rounded-xl border-2 transition-colors",
              toneClass[v],
              activeTone === v ? "border-pink" : "border-transparent",
            )}
          />
        ))}
      </div>
    </div>
  );
}
