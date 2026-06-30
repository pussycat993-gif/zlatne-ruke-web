// Zaglavlje admin ekrana: mono "eyebrow" + naslov sa opcionim script akcentom.
export function PageHead({
  eyebrow,
  title,
  accent,
  right,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="font-mono text-xs uppercase tracking-[0.18em] text-ink">
          {eyebrow}
        </div>
        <h1 className="mt-1 font-heading text-3xl font-semibold text-foreground md:text-[2.4rem]">
          {title}
          {accent && <span className="font-script text-pink"> {accent}</span>}
        </h1>
      </div>
      {right}
    </div>
  );
}
