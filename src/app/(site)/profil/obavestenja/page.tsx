import Link from "next/link";
import type { Metadata } from "next";
import { Icon, type IconName } from "@/components/icon";
import { Crumbs } from "@/components/site/crumbs";
import {
  getNotifications,
  markNotificationsRead,
  type NotificationRow,
} from "@/lib/notifications";

export const metadata: Metadata = {
  title: "Obaveštenja - Zlatne Ruke",
  robots: { index: false, follow: false },
};

const ICONS: Record<string, IconName> = {
  follow: "user",
  review: "star",
  message: "chat",
};

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("sr-RS", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function NotificationItem({ n }: { n: NotificationRow }) {
  const inner = (
    <div
      className={`flex items-start gap-3 px-5 py-4 transition-colors ${
        n.read ? "" : "bg-pink-light/40"
      } ${n.href ? "hover:bg-cream" : ""}`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-pink-light text-pink-dark">
        <Icon name={ICONS[n.type] ?? "bell"} size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-pink-dark">{n.title}</div>
        {n.body && <div className="text-sm text-ink">{n.body}</div>}
        <div className="mt-0.5 font-mono text-xs text-ink-soft">
          {formatDate(n.createdAt)}
        </div>
      </div>
      {!n.read && (
        <span className="mt-1 size-2 shrink-0 rounded-full bg-pink" />
      )}
    </div>
  );
  return n.href ? <Link href={n.href}>{inner}</Link> : inner;
}

export default async function NotificationsPage() {
  const items = await getNotifications();
  // Otvaranje strane = sve pročitano (za sledeću posetu).
  await markNotificationsRead();

  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 md:px-8">
      <Crumbs
        items={[
          { label: "Početna", href: "/" },
          { label: "Profil", href: "/profil" },
          { label: "Obaveštenja" },
        ]}
      />

      <h1 className="mb-6 font-heading text-3xl font-semibold text-foreground md:text-4xl">
        Obaveštenja
      </h1>

      {items.length > 0 ? (
        <div className="divide-y divide-line-soft overflow-hidden rounded-2xl border border-line-soft bg-surface">
          {items.map((n) => (
            <NotificationItem key={n.id} n={n} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-line-soft bg-cream px-6 py-16 text-center">
          <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-surface text-pink">
            <Icon name="bell" size={26} />
          </span>
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Nema obaveštenja
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink">
            Ovde stižu nova praćenja, recenzije i poruke.
          </p>
        </div>
      )}
    </div>
  );
}
