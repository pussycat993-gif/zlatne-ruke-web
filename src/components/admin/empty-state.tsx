import { Icon } from "@/components/icon";

// Prazno stanje sa cvetom (kad nema stavki za moderaciju).
export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-line-soft bg-surface px-6 py-14 text-center">
      <Icon name="flower" size={46} className="text-pink/40" strokeWidth={1.5} />
      <h3 className="mt-3 font-heading text-lg font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-1 text-sm text-ink">{text}</p>
    </div>
  );
}
