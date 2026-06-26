import Link from "next/link";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  /** Rukopisni (Caveat) nastavak naslova — prelama se u novi red. */
  script?: string;
  sub?: string;
  action?: { href: string; label: string };
};

export function SectionHeader({
  eyebrow,
  title,
  script,
  sub,
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="mb-2.5 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink">
            {eyebrow}
          </div>
        )}
        <h2 className="text-balance font-heading text-3xl font-semibold leading-tight text-foreground md:text-4xl">
          {title}
          {script && (
            <>
              {" "}
              <span className="font-script font-normal text-pink">
                {script}
              </span>
            </>
          )}
        </h2>
        {sub && (
          <p className="mt-3 max-w-xl text-pretty text-sm text-ink md:text-base">
            {sub}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="text-sm font-semibold text-pink transition-colors hover:text-pink-dark"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}
