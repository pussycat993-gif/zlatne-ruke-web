"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";

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
    <Button
      type="button"
      variant="outline"
      size={iconOnly ? "icon" : "default"}
      onClick={onClick}
      aria-label="Podeli"
      title="Podeli"
      className={className}
    >
      <Icon name={copied ? "check" : "share"} size={iconOnly ? 18 : 16} />
      {!iconOnly && (copied ? "Kopirano" : "Podeli")}
    </Button>
  );
}
