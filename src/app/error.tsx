"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/site/logo";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Mesto za logovanje greške (npr. Sentry) u budućnosti.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line-soft px-4 py-4 md:px-8">
        <Logo />
      </header>
      <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <span className="mb-6 flex size-16 items-center justify-center rounded-full bg-pink-light text-pink">
          <Icon name="refresh" size={30} />
        </span>
        <h1 className="text-balance font-heading text-3xl font-semibold text-foreground md:text-4xl">
          Nešto je pošlo naopako
        </h1>
        <p className="mt-3 text-ink">
          Došlo je do greške. Pokušaj ponovo ili se vrati na početnu.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button type="button" size="cta" onClick={() => reset()}>
            Pokušaj ponovo
          </Button>
          <Button asChild size="cta" variant="outline">
            <Link href="/">Na početnu</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
