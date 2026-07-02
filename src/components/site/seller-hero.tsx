"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { OtvoriRadnjuButton } from "@/components/ui/otvori-radnju-button";
import { ShimmerWord } from "@/components/site/shimmer-word";
import { CountUp } from "@/components/site/count-up";
import { cn } from "@/lib/utils";

const EASE = [0.2, 0.7, 0.2, 1] as [number, number, number, number];

// Kartice: pozicija+veličina, rotacija, plutanje (dy/dur/delay), dubina paralakse
// i redosled fade-ina.
const CARDS = [
  { pos: "left-0 top-0 h-72 w-56", rotate: -5, dy: -16, dur: 7, delay: 1.3, depth: 0.02, fade: 0.4 },
  { pos: "right-2 top-14 h-80 w-52", rotate: 3, dy: 14, dur: 8, delay: 1.5, depth: 0.035, fade: 0.55 },
  { pos: "bottom-0 left-12 h-56 w-48", rotate: 7, dy: -20, dur: 6.5, delay: 1.4, depth: 0.05, fade: 0.7 },
];

export function SellerHero() {
  const reduce = useReducedMotion();
  const areaRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Ulazna „rise" animacija za levu kolonu (opacity+y, stagger po delay-u).
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: EASE, delay },
        };

  function onMove(e: React.MouseEvent) {
    if (reduce || !areaRef.current) return;
    const r = areaRef.current.getBoundingClientRect();
    setMouse({
      x: e.clientX - (r.left + r.width / 2),
      y: e.clientY - (r.top + r.height / 2),
    });
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden text-foreground",
        // Svetla tema: topli krem radial; tamna: dark burgundy radial.
        "bg-[radial-gradient(120%_120%_at_85%_0%,#fdf6f0_0%,#f8ebdd_60%)]",
        "dark:bg-[radial-gradient(120%_120%_at_85%_0%,#33222a_0%,#2e1e24_60%)]",
      )}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:py-24">
        {/* Leva kolona */}
        <div>
          <motion.div
            {...rise(0.05)}
            className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink"
          >
            Za majstorice & kreatorke
          </motion.div>

          <motion.h1
            {...rise(0.18)}
            className="text-balance font-playfair text-5xl font-semibold leading-[0.98] text-foreground md:text-7xl"
          >
            Tvoje ruke{" "}
            <ShimmerWord delay={1000} className="font-script font-normal text-pink">
              zaslužuju
            </ShimmerWord>{" "}
            tržište.
          </motion.h1>

          <motion.p
            {...rise(0.31)}
            className="mt-6 max-w-md text-pretty text-base leading-relaxed text-ink md:text-lg"
          >
            Otvori radnju za nekoliko minuta. Prodaj na celu Srbiju. Mi se
            brinemo o sajtu i vidljivosti - ti pleti, mesi, kuj. Bez provizije,
            bez mesečne pretplate.
          </motion.p>

          <motion.div {...rise(0.44)} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <OtvoriRadnjuButton />
            <Button asChild size="cta" variant="outline">
              <Link href="/magazin">Pročitaj priče prodavačica</Link>
            </Button>
          </motion.div>

          <motion.div {...rise(0.57)} className="mt-10 flex gap-8">
            <StatBlock value={<CountUp to={247} delay={650} />} label="aktivnih radnji" />
            <StatBlock value={<CountUp to={38} delay={650} />} label="gradova" />
            {/* Nula je poenta (bez provizije) — NE animira se. */}
            <StatBlock value="0 RSD" label="provizija po prodaji" />
          </motion.div>
        </div>

        {/* Desna kolona — plutajuće kartice + paralaksa miša */}
        <div
          ref={areaRef}
          onMouseMove={onMove}
          onMouseLeave={() => setMouse({ x: 0, y: 0 })}
          className="relative h-[420px] md:h-[520px]"
        >
          {CARDS.map((c, i) => (
            <div
              key={i}
              className={cn("absolute", c.pos)}
              style={{
                transform: `translate(${mouse.x * c.depth}px, ${mouse.y * c.depth}px)`,
                transition: "transform 0.4s ease-out",
              }}
            >
              <motion.div
                className="h-full w-full rounded-3xl bg-gradient-to-br from-[var(--zr-pink-tint)] to-[var(--zr-cream-deep)] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)] ring-1 ring-black/5 dark:ring-white/5"
                initial={reduce ? false : { opacity: 0, rotate: c.rotate }}
                animate={
                  reduce
                    ? { opacity: 1, rotate: c.rotate }
                    : { opacity: 1, rotate: c.rotate, y: [0, c.dy, 0] }
                }
                transition={
                  reduce
                    ? undefined
                    : {
                        opacity: { duration: 0.7, delay: c.fade },
                        rotate: { duration: 0.7, delay: c.fade },
                        y: {
                          duration: c.dur,
                          delay: c.delay,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }
                }
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatBlock({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div>
      <div className="font-playfair text-3xl font-semibold text-foreground">
        {value}
      </div>
      <div className="mt-1.5 font-mono text-xs tracking-wide text-ink">{label}</div>
    </div>
  );
}
