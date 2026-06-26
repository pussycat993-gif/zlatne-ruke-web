import Link from "next/link";
import { type Story, toneClass } from "@/lib/data";

export function StoryCard({
  story,
  shopName,
  large,
}: {
  story: Story;
  shopName?: string;
  large?: boolean;
}) {
  return (
    <Link href={`/magazin/${story.id}`} className="group block">
      <div
        className={`w-full rounded-2xl ${toneClass[story.tone]} ${
          large ? "aspect-[3/2] md:aspect-[5/4]" : "aspect-[3/2]"
        }`}
      />
      <div className="mt-4">
        <div className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink">
          Priča · {story.readTime}
        </div>
        <h3
          className={`mt-2 text-balance font-heading font-semibold leading-snug text-foreground transition-colors group-hover:text-pink-dark ${
            large ? "text-2xl" : "text-lg"
          }`}
        >
          {story.title}
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-ink">
          {story.excerpt}
        </p>
        <div className="mt-3 font-mono text-xs tracking-wide text-ink-soft">
          {shopName} · {story.date}
        </div>
      </div>
    </Link>
  );
}
