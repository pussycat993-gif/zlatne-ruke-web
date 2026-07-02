import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Crumbs } from "@/components/site/crumbs";
import { mdxComponents } from "@/components/saveti/mdx";
import { getSavetBySlug, getAllSlugs } from "@/lib/saveti";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getSavetBySlug(slug);
  if (!article) return {};

  const url = `${SITE_URL}/saveti/${article.slug}`;
  const ogImage = cloudinaryUrl(article.coverImage, { width: 1200 });
  const title = article.metaTitle || article.title;

  return {
    title,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: article.description,
      type: "article",
      url,
      siteName: SITE_NAME,
      publishedTime: article.date,
      images: [{ url: ogImage, alt: article.coverAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: article.description,
      images: [ogImage],
    },
  };
}

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("sr-RS", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export default async function SavetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getSavetBySlug(slug);
  if (!article) notFound();

  const url = `${SITE_URL}/saveti/${article.slug}`;
  const ogImage = cloudinaryUrl(article.coverImage, { width: 1200 });

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: [ogImage],
    datePublished: article.date,
    dateModified: article.date,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  const faqSchema =
    article.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <article className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <Crumbs
        items={[
          { label: "Početna", href: "/" },
          { label: "Saveti", href: "/saveti" },
          { label: article.title },
        ]}
      />

      <header>
        <Badge asChild variant="secondary">
          <Link href={`/katalog?cat=${article.category}`}>
            {article.categoryLabel}
          </Link>
        </Badge>
        <h1 className="mt-4 text-balance font-heading text-3xl font-semibold leading-tight text-foreground md:text-5xl">
          {article.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs text-ink-soft">
          <span className="flex items-center gap-1.5">
            <Icon name="calendar" size={14} />
            {formatDate(article.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="clock" size={14} />
            {article.readingMinutes} min čitanja
          </span>
        </div>
      </header>

      <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-3xl shadow-[var(--zr-shadow)]">
        <Image
          src={ogImage}
          alt={article.coverAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>

      <div className="prose prose-neutral mt-10 max-w-none prose-headings:font-heading prose-headings:text-foreground prose-h2:text-2xl prose-h3:text-xl prose-p:text-ink prose-li:text-ink prose-a:font-medium prose-a:text-pink prose-a:no-underline hover:prose-a:text-pink-dark hover:prose-a:underline prose-strong:text-pink-dark prose-li:marker:text-pink">
        <MDXRemote
          source={article.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: "wrap" }],
              ],
            },
          }}
        />
      </div>

      {article.faq.length > 0 && (
        <section className="mt-14 border-t border-line-soft pt-10">
          <h2 className="mb-6 font-heading text-2xl font-semibold text-foreground">
            Česta pitanja
          </h2>
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {article.faq.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger>{f.question}</AccordionTrigger>
                <AccordionContent>{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      <div className="mt-14 rounded-3xl bg-pink-tint px-6 py-10 text-center">
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          Pronađite pravi komad
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink">
          Pogledajte rukotvorine domaćih majstorica i pošaljite upit direktno
          autorki.
        </p>
        <Button asChild size="default" className="mt-6">
          <Link href="/katalog">Pogledajte katalog</Link>
        </Button>
      </div>
    </article>
  );
}
