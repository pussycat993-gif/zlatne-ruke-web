"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

// „Podeli" — nativni share (mobilni) sa fallback-om na kopiranje linka.
export function ShareButton({
  title,
  iconOnly = false,
  className,
}: {
  title?: string;
  iconOnly?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onClick() {
    const url = window.location.href;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: title ?? document.title, url });
        return;
      } catch {
        return; // korisnik otkazao
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard nedostupan — ništa
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Podeli"
      title="Podeli"
      className={cn(
        "transition-colors",
        !className &&
          "inline-flex items-center gap-2 rounded-full border border-line px-6 py-2.5 text-sm font-semibold text-pink-dark hover:bg-pink-light",
        className,
      )}
    >
      <Icon name={copied ? "check" : "share"} size={iconOnly ? 18 : 16} />
      {!iconOnly && (copied ? "Kopirano" : "Podeli")}
    </button>
  );
}
