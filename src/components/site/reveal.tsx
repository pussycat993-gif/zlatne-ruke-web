"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

// Deljeni scroll-reveal (opacity + y), kreće jednom kad uđe u vidokrug.
// Isti ease kao ostatak sajta; `delay` služi za stagger niza kartica.
const EASE = [0.2, 0.7, 0.2, 1] as [number, number, number, number];

export function Reveal({
  children,
  delay = 0,
  y = 34,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={
        reduce
          ? { opacity: 1 }
          : inView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y }
      }
      transition={reduce ? undefined : { duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
