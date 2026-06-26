import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const CONTENT_DIR = path.join(process.cwd(), "content", "saveti");

export type SavetFaq = { question: string; answer: string };

export type SavetMeta = {
  title: string;
  metaTitle?: string;
  description: string;
  slug: string;
  category: string;
  categoryLabel: string;
  date: string;
  coverImage: string;
  coverAlt: string;
  tags: string[];
  draft: boolean;
  faq: SavetFaq[];
  readingMinutes: number;
};

export type Savet = SavetMeta & { content: string };

// Sirovi oblik frontmatter-a iz .mdx fajla (pre normalizacije).
type RawFrontmatter = {
  title?: string;
  metaTitle?: string;
  description?: string;
  slug?: string;
  category?: string;
  categoryLabel?: string;
  date?: string;
  coverImage?: string;
  coverAlt?: string;
  tags?: string[];
  draft?: boolean;
  faq?: SavetFaq[];
};

function readFileForSlug(slug: string): Savet | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as RawFrontmatter;

  if (!fm.title || !fm.description) return null;

  const stats = readingTime(content);

  return {
    title: fm.title,
    metaTitle: fm.metaTitle,
    description: fm.description,
    slug: fm.slug ?? slug,
    category: fm.category ?? "",
    categoryLabel: fm.categoryLabel ?? "",
    date: fm.date ?? "",
    coverImage: fm.coverImage ?? "saveti/placeholder",
    coverAlt: fm.coverAlt ?? fm.title,
    tags: fm.tags ?? [],
    draft: fm.draft ?? false,
    faq: fm.faq ?? [],
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
    content,
  };
}

function listSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

// Svi članci (bez draft-ova), sortirani po datumu opadajuće. Vraća meta bez tela.
export function getAllSaveti(): SavetMeta[] {
  return listSlugs()
    .map(readFileForSlug)
    .filter((a): a is Savet => a !== null && !a.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ content: _content, ...meta }) => meta);
}

// Jedan članak (meta + telo). Draft-ovi se tretiraju kao nepostojeći.
export function getSavetBySlug(slug: string): Savet | null {
  const article = readFileForSlug(slug);
  if (!article || article.draft) return null;
  return article;
}

// Slugovi za generateStaticParams.
export function getAllSlugs(): string[] {
  return getAllSaveti().map((a) => a.slug);
}
