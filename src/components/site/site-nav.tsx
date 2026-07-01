"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { Logo } from "@/components/site/logo";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { cn } from "@/lib/utils";

// Glavni linkovi (Kategorije su poseban padajući meni; v1 bez korpe/plaćanja).
const NAV_LINKS = [
  { href: "/magazin", label: "Priče" },
  { href: "/saveti", label: "Saveti" },
  { href: "/postani-prodavac", label: "Postani prodavac" },
  { href: "/o-nama", label: "O nama" },
] as const;

type Category = { id: string; name: string };

export function SiteNav({
  categories = [],
  notifCount = 0,
  isAdmin = false,
}: {
  categories?: Category[];
  notifCount?: number;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/katalog?q=${encodeURIComponent(q)}` : "/katalog");
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line-soft bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:gap-8 md:px-8 md:py-4">
        <Logo />

        {/* Linkovi — desktop */}
        <nav className="hidden flex-1 items-center gap-7 lg:flex">
          {/* Kategorije — padajući meni */}
          <div
            className="relative"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <Link
              href="/katalog"
              className={cn(
                "flex items-center gap-1 text-sm font-semibold transition-colors hover:text-pink-dark",
                isActive("/katalog") ? "text-pink-dark" : "text-ink",
              )}
            >
              Kategorije
              <Icon name="chevronDown" size={14} />
            </Link>
            {catOpen && categories.length > 0 && (
              <div className="absolute left-0 top-full z-50 pt-3">
                <div className="w-56 rounded-2xl border border-line-soft bg-surface p-2 shadow-[var(--zr-shadow-lg)]">
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/katalog?cat=${c.id}`}
                      onClick={() => setCatOpen(false)}
                      className="block rounded-xl px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-pink-light hover:text-pink-dark"
                    >
                      {c.name}
                    </Link>
                  ))}
                  <Link
                    href="/katalog"
                    onClick={() => setCatOpen(false)}
                    className="mt-1 block rounded-xl border-t border-line-soft px-3 py-2 text-sm font-semibold text-pink hover:text-pink-dark"
                  >
                    Sve kategorije →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-semibold transition-colors hover:text-pink-dark",
                isActive(link.href) ? "text-pink-dark" : "text-ink",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Pretraga — desktop */}
        <form
          onSubmit={submitSearch}
          className="relative hidden flex-1 lg:block lg:max-w-xs"
        >
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">
            <Icon name="search" size={16} />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pretraži šal, sveće, sapune…"
            className="w-full rounded-full border border-line bg-cream py-2.5 pl-11 pr-4 text-sm text-pink-dark outline-none placeholder:text-ink-soft focus:border-pink"
          />
        </form>

        {/* Desni klaster */}
        <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
          <ThemeToggle />
          <Show when="signed-in">
            <Link
              href="/profil/obavestenja"
              aria-label="Obaveštenja"
              className="relative hidden size-10 items-center justify-center rounded-full text-pink-dark transition-colors hover:bg-pink-light sm:flex"
            >
              <Icon name="bell" size={20} />
              {notifCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-pink px-1 text-[0.6rem] font-bold text-primary-foreground">
                  {notifCount}
                </span>
              )}
            </Link>
            <Link
              href="/profil/omiljeno"
              aria-label="Omiljeno"
              className="hidden size-10 items-center justify-center rounded-full text-pink-dark transition-colors hover:bg-pink-light sm:flex"
            >
              <Icon name="heart" size={20} />
            </Link>
            <UserButton
              appearance={{ elements: { avatarBox: "size-9" } }}
              userProfileProps={{ appearance: { variables: { colorPrimary: "#C0637A" } } }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Moj profil"
                  labelIcon={<Icon name="user" size={15} />}
                  href="/profil"
                />
                {isAdmin && (
                  <UserButton.Link
                    label="Admin panel"
                    labelIcon={<Icon name="shield" size={15} />}
                    href="/admin"
                  />
                )}
              </UserButton.MenuItems>
            </UserButton>
          </Show>
          <Show when="signed-out">
            <Button asChild size="compact" className="hidden sm:inline-flex">
              <Link href="/login">Prijava</Link>
            </Button>
          </Show>

          {/* Hamburger — mobilni */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Zatvori meni" : "Otvori meni"}
            aria-expanded={mobileOpen}
            className="flex size-10 items-center justify-center rounded-full text-pink-dark transition-colors hover:bg-pink-light lg:hidden"
          >
            <Icon name={mobileOpen ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>

      {/* Mobilni meni */}
      {mobileOpen && (
        <div className="border-t border-line-soft bg-surface px-4 py-4 lg:hidden">
          <form onSubmit={submitSearch} className="relative mb-4">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">
              <Icon name="search" size={16} />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pretraži…"
              className="w-full rounded-full border border-line bg-cream py-2.5 pl-11 pr-4 text-sm text-pink-dark outline-none placeholder:text-ink-soft focus:border-pink"
            />
          </form>
          <nav className="flex flex-col">
            {/* Kategorije */}
            {categories.length > 0 && (
              <div className="mb-2 border-b border-line-soft pb-2">
                <div className="px-3 pb-1 pt-1 font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  Kategorije
                </div>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/katalog?cat=${c.id}`}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-pink-light hover:text-pink-dark"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-3 text-sm font-semibold transition-colors hover:bg-pink-light",
                  isActive(link.href) ? "text-pink-dark" : "text-ink",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-wrap gap-2 border-t border-line-soft pt-3">
              <Show when="signed-in">
                <Button
                  asChild
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setMobileOpen(false)}
                >
                  <Link href="/profil">
                    <Icon name="user" size={18} /> Profil
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setMobileOpen(false)}
                >
                  <Link href="/profil/obavestenja">
                    <Icon name="bell" size={18} /> Obaveštenja
                    {notifCount > 0 && (
                      <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-pink px-1.5 text-[0.65rem] font-bold text-primary-foreground">
                        {notifCount}
                      </span>
                    )}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setMobileOpen(false)}
                >
                  <Link href="/profil/omiljeno">
                    <Icon name="heart" size={18} /> Omiljeno
                  </Link>
                </Button>
                {isAdmin && (
                  <Button
                    asChild
                    className="flex-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href="/admin">
                      <Icon name="shield" size={18} /> Admin
                    </Link>
                  </Button>
                )}
              </Show>
              <Show when="signed-out">
                <Button
                  asChild
                  className="flex-1"
                  onClick={() => setMobileOpen(false)}
                >
                  <Link href="/login">Prijava</Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setMobileOpen(false)}
                >
                  <Link href="/register">Registracija</Link>
                </Button>
              </Show>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
