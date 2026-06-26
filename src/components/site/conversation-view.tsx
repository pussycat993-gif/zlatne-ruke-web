import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { ReplyForm } from "@/components/site/reply-form";
import { getConversationForViewer } from "@/lib/messages";

function formatTime(d: Date): string {
  return new Intl.DateTimeFormat("sr-RS", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

// Prikaz jednog razgovora + forma za odgovor. Deli ga kupac i prodavac.
export async function ConversationView({
  conversationId,
  backHref,
}: {
  conversationId: string;
  backHref: string;
}) {
  const convo = await getConversationForViewer(conversationId);
  if (!convo) notFound();

  const title =
    convo.viewerRole === "seller" ? convo.buyerName : convo.shopName;

  return (
    <div className="mx-auto flex max-w-2xl flex-col">
      <header className="mb-6 flex items-center gap-3">
        <Link
          href={backHref}
          aria-label="Nazad na poruke"
          className="flex size-9 items-center justify-center rounded-full border border-line text-pink-dark transition-colors hover:bg-pink-light"
        >
          <Icon name="back" size={16} />
        </Link>
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">
            {title}
          </h1>
          {convo.viewerRole === "buyer" && (
            <Link
              href={`/radnja/${convo.shopId}`}
              className="text-xs font-semibold text-pink hover:text-pink-dark"
            >
              Poseti radnju →
            </Link>
          )}
        </div>
      </header>

      <div className="space-y-3">
        {convo.messages.length === 0 && (
          <p className="rounded-2xl bg-cream px-4 py-6 text-center text-sm text-ink">
            Započni razgovor porukom ispod.
          </p>
        )}
        {convo.messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.mine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                m.mine
                  ? "bg-pink text-primary-foreground"
                  : "bg-cream text-foreground"
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {m.body}
              </p>
              <div
                className={`mt-1 text-[0.65rem] ${
                  m.mine ? "text-white/70" : "text-ink-soft"
                }`}
              >
                {formatTime(m.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <ReplyForm conversationId={convo.id} />
    </div>
  );
}
