import Link from "next/link";
import { Show } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { becomeSeller } from "@/lib/seller-actions";

// Ulogovan korisnik => server akcija ga pretvara u prodavca i vodi u panel.
// Neulogovan => ide na registraciju.
export function BecomeSellerButton({
  className,
  children = "Otvori radnju",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <Show when="signed-out">
        <Button asChild size="lg" className={className}>
          <Link href="/register">{children}</Link>
        </Button>
      </Show>
      <Show when="signed-in">
        <form action={becomeSeller}>
          <Button type="submit" size="lg" className={className}>
            {children}
          </Button>
        </form>
      </Show>
    </>
  );
}
