"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/icon";
import { cn } from "@/lib/utils";

export type PanelNavItem = {
  href: string;
  label: string;
  icon: IconName;
  badge?: number;
};

// Bočna navigacija panela (prodavac/admin). Horizontalna na mobilnom,
// vertikalna na velikim ekranima. `tone` bira svetlu ili tamnu varijantu.
export function PanelNav({
  items,
  tone = "light",
}: {
  items: PanelNavItem[];
  tone?: "light" | "dark";
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              tone === "dark"
                ? active
                  ? "bg-white/10 font-semibold text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
                : active
                  ? "bg-pink-light font-semibold text-pink-dark"
                  : "text-ink hover:bg-pink-light/60 hover:text-pink-dark",
            )}
          >
            <Icon name={item.icon} size={16} />
            {item.label}
            {item.badge ? (
              <span className="ml-auto inline-flex min-w-5 items-center justify-center rounded-full bg-pink px-1.5 text-[0.65rem] font-bold text-primary-foreground">
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
