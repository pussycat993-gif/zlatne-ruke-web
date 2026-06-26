import Link from "next/link";

type Crumb = { label: string; href?: string };

// Putanja (breadcrumbs). Poslednja stavka je obično bez href-a (trenutna strana).
export function Crumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Putanja"
      className="flex flex-wrap items-center gap-2 py-5 text-xs text-ink"
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-ink-soft">›</span>}
          {item.href ? (
            <Link
              href={item.href}
              className="font-medium transition-colors hover:text-pink-dark"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-pink-dark">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
