import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Crumbs } from "@/components/site/crumbs";
import { getAllSaveti } from "@/lib/saveti";
import { cloudinaryUrl } from "@/lib/cloudinary";

export const metadata: Metadata = {
  title: "Saveti — Zlatne Ruke",
  description:
    "Saveti, ideje i priče o rukotvorinama: kako da izaberete, poklonite i čuvate ručno rađene predmete domaćih majstorica.",
};

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("sr-RS", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export default function SavetiPage() {
  const articles = getAllSaveti();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
      <Crumbs items={[{ label: "Početna", href: "/" }, { label: "Saveti" }]} />

      <header className="mb-10 max-w-2xl">
        <h1 className="text-balance font-heading text-4xl font-semibold text-foreground md:text-5xl">
          Saveti{" "}
          <span className="font-script font-normal text-pink">& ideje</span>
        </h1>
        <p className="mt-3 text-sm text-ink md:text-base">
          Vodiči, ideje i priče o rukotvorinama — kako da izaberete pravi
          predmet, poklonite ga i sačuvate. Iza svakog saveta stoji iskustvo
          domaćih majstorica.
        </p>
      </header>

      {articles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <Card key={a.slug} className="overflow-hidden pt-0">
              <Link href={`/saveti/${a.slug}`} className="group block">
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={cloudinaryUrl(a.coverImage, { width: 800 })}
                    alt={a.coverAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
              </Link>
              <CardHeader>
                <div>
                  <Badge variant="secondary">{a.categoryLabel}</Badge>
                </div>
                <CardTitle>
                  <Link
                    href={`/saveti/${a.slug}`}
                    className="transition-colors hover:text-pink-dark"
                  >
                    {a.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {a.description}
                </CardDescription>
              </CardHeader>
              <CardContent />
              <CardFooter className="mt-auto gap-4 font-mono text-xs text-ink-soft">
                <span className="flex items-center gap-1.5">
                  <Icon name="calendar" size={14} />
                  {formatDate(a.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Icon name="clock" size={14} />
                  {a.readingMinutes} min
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-ink">Uskoro stižu prvi saveti.</p>
      )}
    </div>
  );
}
