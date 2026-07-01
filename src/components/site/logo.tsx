import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Logo — zvanični „Zlatne Ruke" znak (zlatni, prozirna pozadina). Vodi na naslovnu.
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Zlatne Ruke — početna"
      className={cn("inline-flex items-center", className)}
    >
      <Image
        src="/zlatne-ruke-logo-crop.png"
        alt="Zlatne Ruke"
        width={800}
        height={320}
        priority
        className="h-9 w-auto md:h-10"
      />
    </Link>
  );
}
