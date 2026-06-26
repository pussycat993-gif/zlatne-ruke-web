import Link from "next/link";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";

export function NotFoundContent() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <span className="mb-6 flex size-16 items-center justify-center rounded-full bg-pink-light text-pink">
        <Icon name="search" size={30} />
      </span>
      <div className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-ink">
        Greška 404
      </div>
      <h1 className="mt-3 text-balance font-heading text-4xl font-semibold text-foreground">
        Ova stranica je{" "}
        <span className="font-script font-normal text-pink">odlutala.</span>
      </h1>
      <p className="mt-3 text-ink">
        Možda je predmet uklonjen ili je adresa pogrešna. Vrati se i nastavi da
        istražuješ.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="h-11 rounded-full px-7 text-sm">
          <Link href="/">Na početnu</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-11 rounded-full border-line px-7 text-sm text-pink-dark"
        >
          <Link href="/katalog">Istraži katalog</Link>
        </Button>
      </div>
    </div>
  );
}
