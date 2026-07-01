import type { Metadata } from "next";
import { ConversationView } from "@/components/site/conversation-view";

export const metadata: Metadata = { title: "Razgovor - Panel prodavca" };

export default async function SellerThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ConversationView conversationId={id} backHref="/prodavac/poruke" />;
}
