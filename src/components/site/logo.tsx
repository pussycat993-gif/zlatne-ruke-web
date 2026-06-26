import Link from "next/link";
import { cn } from "@/lib/utils";

// Logo — ZR monogram (rukopisni Caveat) + naziv. Vodi na naslovnu.
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Zlatne Ruke — početna"
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <span className="font-script text-3xl leading-none text-pink">ZR</span>
      <span className="hidden font-sans text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-pink-dark sm:inline">
        Zlatne · Ruke
      </span>
    </Link>
  );
}
