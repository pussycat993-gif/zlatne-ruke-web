import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { getSellerConversations } from "@/lib/messages";

export const metadata: Metadata = { title: "Poruke - Panel prodavca" };

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("sr-RS", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function SellerMessagesPage() {
  const conversations = await getSellerConversations();

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-semibold text-foreground md:text-3xl">
        Poruke od kupaca
      </h1>

      {conversations.length > 0 ? (
        <div className="divide-y divide-line-soft overflow-hidden rounded-2xl border border-line-soft bg-surface">
          {conversations.map((c) => (
            <Link
              key={c.id}
              href={`/prodavac/poruke/${c.id}`}
              className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-cream"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-pink-light font-semibold text-pink-dark">
                {c.title.charAt(0) || "K"}
              </span>
              <span
                className={`flex-1 truncate text-pink-dark ${c.unread ? "font-bold" : "font-semibold"}`}
              >
                {c.title}
              </span>
              {c.unread && (
                <span
                  className="size-2 shrink-0 rounded-full bg-pink"
                  aria-label="Nepročitano"
                />
              )}
              <span className="shrink-0 font-mono text-xs text-ink-soft">
                {formatDate(c.lastMessageAt)}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-line-soft bg-surface px-6 py-12 text-center">
          <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-pink-light text-pink-dark">
            <Icon name="chat" size={22} />
          </span>
          <p className="text-sm text-ink">
            Još nema poruka. Kada ti kupac pošalje upit, pojaviće se ovde.
          </p>
        </div>
      )}
    </div>
  );
}
