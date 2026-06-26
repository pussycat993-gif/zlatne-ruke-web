import type { Metadata } from "next";
import { ConversationView } from "@/components/site/conversation-view";

export const metadata: Metadata = { title: "Razgovor — Zlatne Ruke" };

export default async function BuyerThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="px-4 pb-20 md:px-8">
      <ConversationView conversationId={id} backHref="/profil/poruke" />
    </div>
  );
}
