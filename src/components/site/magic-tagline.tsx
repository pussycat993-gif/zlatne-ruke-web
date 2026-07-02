"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// Raspored zvezdica oko script dela (u % u odnosu na taj span), sa različitim
// kašnjenjima da trepere van takta.
type Star = { top: string; left: string; size: number; delay: number };
const STARS: Star[] = [
  { top: "-20%", left: "4%", size: 12, delay: 0.6 },
  { top: "-34%", left: "34%", size: 9, delay: 1.1 },
  { top: "-16%", left: "70%", size: 13, delay: 0.9 },
  { top: "30%", left: "-5%", size: 10, delay: 1.4 },
  { top: "82%", left: "20%", size: 11, delay: 0.8 },
  { top: "86%", left: "58%", size: 9, delay: 1.6 },
  { top: "44%", left: "99%", size: 12, delay: 1.2 },
];

// Četvorokraka zvezda sa mekim zlatnim sjajem.
function Star4({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#f4dca4"
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 0 3px rgba(244, 220, 164, 0.8))" }}
    >
      <path d="M12 0c1 8 3 11 12 12-9 1-11 4-12 12-1-8-3-11-12-12 9-1 11-4 12-12Z" />
    </svg>
  );
}

export function MagicTagline({
  lead = "Kad žena stvara srcem,",
  accent = "nastaje magija.",
  trigger = "load",
  className,
}: {
  lead?: string;
  accent?: string;
  /** "load" = kreće pri montiranju (hero); "scroll" = kad uđe u vidokrug. */
  trigger?: "load" | "scroll";
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [active, setActive] = useState(false);
  const [shimmerDone, setShimmerDone] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    if (trigger === "load" || inView) setActive(true);
  }, [trigger, inView, reduceMotion]);

  const shimmering = active && !reduceMotion && !shimmerDone;

  return (
    <span ref={ref} className={cn("font-heading", className)}>
      {lead}{" "}
      <span className="relative inline-block font-script font-normal text-pink">
        {/* Zvezdice (bez pokreta ih uopšte ne prikazujemo) */}
        {!reduceMotion &&
          STARS.map((s, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={cn(
                "zr-star pointer-events-none absolute",
                active && "zr-star--on",
              )}
              style={{ top: s.top, left: s.left, animationDelay: `${s.delay}s` }}
            >
              <Star4 size={s.size} />
            </span>
          ))}

        {/* Script deo: bazno roze (text-pink), jednokratni shimmer pri triggeru */}
        <span
          className={cn(shimmering && "zr-shimmer-text")}
          onAnimationEnd={() => setShimmerDone(true)}
        >
          {accent}
        </span>
      </span>
    </span>
  );
}
