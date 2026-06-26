"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

// Prebacivanje svetla ↔ tamna (zlatna) tema. Menja klasu `.dark` na <html>
// i pamti izbor u localStorage. Inicijalno stanje postavlja inline skripta
// u root layout-u (sprečava treperenje pri učitavanju).
export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("zr-theme", next ? "dark" : "light");
    } catch {
      // localStorage nedostupan (npr. privatni režim) — ignoriši
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Pređi na svetlu temu" : "Pređi na tamnu temu"}
      title={dark ? "Svetla tema" : "Tamna tema · zlatna"}
      className={cn(
        "flex size-10 items-center justify-center rounded-full border border-line text-pink-dark transition-colors hover:border-pink hover:bg-pink-light",
        className,
      )}
    >
      {/* Pre montiranja prikazujemo sunce da se markup poklopi sa serverom */}
      <Icon name={mounted && dark ? "moon" : "sun"} size={18} />
    </button>
  );
}
