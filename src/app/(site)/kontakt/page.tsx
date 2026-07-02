import type { Metadata } from "next";
import { Icon, type IconName } from "@/components/icon";
import { Crumbs } from "@/components/site/crumbs";
import { ContactForm } from "@/components/site/contact-form";

export const metadata: Metadata = {
  title: "Kontakt - Zlatne Ruke",
  description: "Javi nam se - pitanja, predlozi i podrška za kupce i prodavce.",
};

const CHANNELS: { icon: IconName; t: string; d: string }[] = [
  { icon: "chat", t: "Email", d: "podrska@zlatneruke.rs" },
  { icon: "phone", t: "Telefon", d: "Radnim danima 9-17h" },
  { icon: "location", t: "Sedište", d: "Beograd, Srbija" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
      <Crumbs items={[{ label: "Početna", href: "/" }, { label: "Kontakt" }]} />

      <header className="mb-10">
        <h1 className="text-balance font-heading text-4xl font-semibold text-foreground md:text-5xl">
          Javi nam se.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-ink md:text-base">
          Pitanja, predlozi ili pomoć oko radnje - tu smo. Za pitanje o
          konkretnom proizvodu, najbrže je da pišeš direktno majstorici sa
          stranice proizvoda.
        </p>
      </header>

      <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          {CHANNELS.map((c) => (
            <div
              key={c.t}
              className="flex items-center gap-4 rounded-2xl bg-cream p-5"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface text-pink-dark">
                <Icon name={c.icon} size={20} />
              </span>
              <div>
                <div className="text-sm font-bold text-pink-dark">{c.t}</div>
                <div className="text-sm text-ink">{c.d}</div>
              </div>
            </div>
          ))}
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
