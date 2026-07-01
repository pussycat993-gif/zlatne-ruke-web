import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { startConversation } from "@/lib/message-actions";

// „Pošalji upit majstorici" - otvara (ili nastavlja) razgovor sa radnjom.
// Neulogovani se preusmere na prijavu (kroz server akciju).
export function ContactSellerButton({
  shopId,
  children = "Pošalji upit majstorici",
  className,
  variant = "default",
}: {
  shopId: string;
  children?: React.ReactNode;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
}) {
  return (
    <form action={startConversation} className="contents">
      <input type="hidden" name="shopId" value={shopId} />
      <Button type="submit" size="cta" variant={variant} className={className}>
        <Icon name="chat" size={18} /> {children}
      </Button>
    </form>
  );
}
