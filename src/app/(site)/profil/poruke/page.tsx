import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Crumbs } from "@/components/site/crumbs";
import { getBuyerConversations } from "@/lib/messages";

export const metadata: Metadata = { title: "Poruke - Zlatne Ruke" };

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("sr-RS", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function BuyerMessagesPage() {
  const conversations = await getBuyerConversations();

  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 md:px-8">
      <Crumbs
        items={[
          { label: "Početna", href: "/" },
          { label: "Profil", href: "/profil" },
          { label: "Poruke" },
        ]}
      />

      <h1 className="mb-6 font-heading text-3xl font-semibold text-foreground md:text-4xl">
        Poruke
      </h1>

      {conversations.length > 0 ? (
        <div className="divide-y divide-line-soft overflow-hidden rounded-2xl border border-line-soft bg-surface">
          {conversations.map((c) => (
            <Link
              key={c.id}
              href={`/profil/poruke/${c.id}`}
              className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-cream"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-pink-light text-pink-dark">
                <Icon name="chat" size={18} />
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
        <div className="rounded-3xl border border-line-soft bg-cream px-6 py-16 text-center">
          <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-surface text-pink">
            <Icon name="chat" size={26} />
          </span>
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Još nemaš poruke
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink">
            Sa stranice proizvoda ili radnje pošalji upit majstorici.
          </p>
          <Button asChild size="default" className="mt-6">
            <Link href="/katalog">Istraži katalog</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
