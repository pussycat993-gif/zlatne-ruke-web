"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// Jednokratni zlatni shimmer preko reči (isečen na tekst). Bazna boja dolazi iz
// klase (npr. text-pink token), pa radi i u svetloj i u tamnoj temi. Isti
// `.zr-shimmer-text` kao MagicTagline → dosledno.
export function ShimmerWord({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setOn(true), delay);
    return () => clearTimeout(t);
  }, [delay, reduce]);

  const shimmering = on && !reduce && !done;

  return (
    <span
      className={cn(className, shimmering && "zr-shimmer-text")}
      onAnimationEnd={() => setDone(true)}
    >
      {children}
    </span>
  );
}
