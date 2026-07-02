"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Broji od 0 do `to` (easeOutCubic). Uz reduced-motion odmah prikaže krajnju
// vrednost. Namenjeno statistici (247, 38…).
export function CountUp({
  to,
  duration = 1400,
  delay = 0,
  className,
}: {
  to: number;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (reduce) {
      setVal(to);
      return;
    }
    let start = 0;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const timer = setTimeout(() => {
      const tick = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        setVal(Math.round(easeOutCubic(p) * to));
        if (p < 1) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf.current);
    };
  }, [to, duration, delay, reduce]);

  return <span className={className}>{val.toLocaleString("sr-RS")}</span>;
}
