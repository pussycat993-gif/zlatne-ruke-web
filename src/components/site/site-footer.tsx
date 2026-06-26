import Link from "next/link";
import { Icon } from "@/components/icon";

type FooterCol = {
  title: string;
  links: { label: string; href: string }[];
};

const COLUMNS: FooterCol[] = [
  {
    title: "Otkrij",
    links: [
      { label: "Katalog", href: "/katalog" },
      { label: "Radnje", href: "/radnje" },
      { label: "Priče", href: "/magazin" },
      { label: "Saveti", href: "/saveti" },
    ],
  },
  {
    title: "Za prodavce",
    links: [
      { label: "Postani prodavac", href: "/postani-prodavac" },
      { label: "Saveti", href: "/saveti" },
    ],
  },
  {
    title: "Pomoć",
    links: [
      { label: "O nama", href: "/o-nama" },
      { label: "Kontakt", href: "/kontakt" },
      { label: "Česta pitanja", href: "/pomoc" },
    ],
  },
  {
    title: "Pravno",
    links: [
      { label: "Uslovi korišćenja", href: "/uslovi" },
      { label: "Privatnost", href: "/privatnost" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-hero text-hero-foreground">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 md:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-5">
          {/* Brend kolona */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-white/15">
                <Icon name="flower" size={18} />
              </span>
              <span className="font-script text-2xl">Zlatne Ruke</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-current/75">
              Katalog rukotvorina žena iz Srbije. Svaki predmet ima ime, mesto i
              priču.
            </p>
            <p className="mt-3 font-script text-lg text-current/90">
              Kad žena stvara srcem, nastaje magija.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-current/90">
                {col.title}
              </div>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-current/75 transition-colors hover:text-current"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-current/60 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Zlatne Ruke · Srbija</span>
          <span>Prodavci dogovaraju plaćanje i dostavu direktno sa kupcima.</span>
        </div>
      </div>
    </footer>
  );
}
