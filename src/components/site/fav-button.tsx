"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import { toggleFavorite } from "@/lib/social-actions";
import { cn } from "@/lib/utils";

// Dugme „omiljeno" (srce) - upisuje u bazu za ulogovanog korisnika.
// Neulogovani se preusmeravaju na prijavu.
export function FavButton({
  productId,
  initialFavorited = false,
  className,
}: {
  productId: string;
  initialFavorited?: boolean;
  className?: string;
}) {
  const [fav, setFav] = useState(initialFavorited);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const res = await toggleFavorite(productId);
      if (res.needsAuth) {
        router.push("/login");
        return;
      }
      if (res.ok) setFav(res.active);
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={fav}
      aria-label={fav ? "Ukloni iz omiljenih" : "Dodaj u omiljene"}
      className={cn(
        "flex size-9 items-center justify-center rounded-full bg-surface shadow-[var(--zr-shadow-sm)] transition-colors disabled:opacity-60",
        fav ? "text-pink" : "text-ink-soft hover:text-pink",
        className,
      )}
    >
      <Icon name="heart" size={16} filled={fav} />
    </button>
  );
}
