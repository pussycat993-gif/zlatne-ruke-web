"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Show } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { becomeSeller } from "@/lib/seller-actions";
import { cn } from "@/lib/utils";

// Jedinstveno animirano „Otvori radnju" dugme — identična animacija svuda:
//  - idle zlatni shine-sweep (.zr-shine-sweep, guard preko @media reduced-motion)
//  - hover: blago podizanje (motion-safe:hover:-translate-y) + strelica se pomeri
//  - prefers-reduced-motion: bez shine/lift/nudge (sve preko motion-safe: klasa)
// Gradi na deljenom <Button> (ista CVA skala); samo dodaje shine + strelicu.
const SHINE =
  "relative overflow-hidden duration-[250ms] ease-out motion-safe:hover:-translate-y-[3px] motion-safe:hover:shadow-[0_12px_26px_-10px_var(--zr-gold)]";

function Inner({ label }: { label: string }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="zr-shine-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[160%] skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent"
      />
      {label}
      <ArrowRight
        aria-hidden="true"
        strokeWidth={1.5}
        className="size-4 motion-safe:transition-transform motion-safe:duration-[250ms] motion-safe:group-hover/button:translate-x-1"
      />
    </>
  );
}

type Size = React.ComponentProps<typeof Button>["size"];
type Variant = React.ComponentProps<typeof Button>["variant"];

export function OtvoriRadnjuButton({
  href,
  label = "Otvori radnju",
  size = "cta",
  variant = "default",
  target,
  className,
}: {
  /** Ako je zadat, dugme je običan link (npr. hero → /postani-prodavac).
   *  Ako NIJE, ponaša se kao „postani prodavac" akcija (role-aware). */
  href?: string;
  label?: string;
  size?: Size;
  variant?: Variant;
  target?: string;
  className?: string;
}) {
  const cls = cn(SHINE, className);

  if (href) {
    return (
      <Button asChild size={size} variant={variant} className={cls}>
        <Link href={href} target={target}>
          <Inner label={label} />
        </Link>
      </Button>
    );
  }

  // Bez href → pretvara kupca u prodavca (neulogovan → registracija).
  return (
    <>
      <Show when="signed-out">
        <Button asChild size={size} variant={variant} className={cls}>
          <Link href="/register">
            <Inner label={label} />
          </Link>
        </Button>
      </Show>
      <Show when="signed-in">
        <form action={becomeSeller}>
          <Button type="submit" size={size} variant={variant} className={cls}>
            <Inner label={label} />
          </Button>
        </form>
      </Show>
    </>
  );
}
