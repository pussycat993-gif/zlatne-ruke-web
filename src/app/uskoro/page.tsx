"use client";

import { useState } from "react";
import { Sparkle, Sparkles, Star, Loader2, Bell, Check } from "lucide-react";
import { Logo } from "@/components/site/logo";

// „Coming soon" stranica. Prikazuje se posetiocima dok je MAINTENANCE_MODE='true'
// (osim adminima — vidi proxy.ts). Samostalna: koristi root layout (fontovi,
// ClerkProvider), bez SiteNav/Footer-a. Isključivo brand tokeni, bez hardkodovanih
// boja. Sve animacije poštuju prefers-reduced-motion.

type Status = "idle" | "loading" | "subscribed" | "duplicate" | "invalid" | "error";

const MESSAGES: Record<Exclude<Status, "idle" | "loading">, string> = {
  subscribed: "Hvala, javićemo vam se čim krenemo.",
  duplicate: "Već ste prijavljeni.",
  invalid: "Proverite email adresu i pokušajte ponovo.",
  error: "Trenutno ne možemo da sačuvamo prijavu. Pokušajte malo kasnije.",
};

export default function UskoroPage() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");

  const done = status === "subscribed" || status === "duplicate";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      const data = (await res.json().catch(() => null)) as
        | { status?: Status }
        | null;
      const next = data?.status;
      if (
        next === "subscribed" ||
        next === "duplicate" ||
        next === "invalid" ||
        next === "error"
      ) {
        setStatus(next);
        if (next === "subscribed") setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="usk flex min-h-dvh flex-col items-center justify-center bg-cream px-5 py-14 text-center">
      {/* Lokalni stilovi — svi ispod prefers-reduced-motion: no-preference. */}
      <style>{`
        .usk-script { color: var(--zr-gold-deep); }
        @media (prefers-reduced-motion: no-preference) {
          .usk-script {
            background-image: linear-gradient(100deg, var(--zr-gold-deep) 28%, #f4dca4 50%, var(--zr-gold-deep) 72%);
            background-size: 250% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            -webkit-text-fill-color: transparent;
            animation: usk-shimmer 4s ease-in-out infinite;
          }
          .usk-spark { animation: usk-twinkle 2.6s ease-in-out infinite; }
          .usk-spark-2 { animation: usk-twinkle 2.6s ease-in-out .5s infinite; }
          .usk-spark-3 { animation: usk-twinkle 2.6s ease-in-out 1s infinite; }
          .usk-spark-4 { animation: usk-twinkle 2.6s ease-in-out 1.4s infinite; }
          .usk-fill { animation: usk-pulse 2.8s ease-in-out infinite; }
        }
        @keyframes usk-shimmer {
          from { background-position: 120% 0; }
          to { background-position: -40% 0; }
        }
        @keyframes usk-twinkle {
          0%, 100% { opacity: .35; transform: scale(.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.12) rotate(14deg); }
        }
        @keyframes usk-pulse {
          0%, 100% { opacity: .8; }
          50% { opacity: 1; }
        }
      `}</style>

      <div className="flex w-full max-w-xl flex-col items-center">
        {/* Logo */}
        <Logo className="mb-9" />

        {/* Kicker */}
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.32em] text-pink">
          Stiže uskoro
        </p>

        {/* Naslov */}
        <h1 className="mt-5">
          <span className="block font-playfair text-3xl font-semibold leading-tight text-pink-dark sm:text-4xl md:text-5xl">
            Kad žena stvara srcem,
          </span>
          {/* Script linija sa zvezdicama SAMO oko nje. Dovoljno line-height +
              padding-bottom da opušci (j, g) nikad nisu isečeni. */}
          <span className="relative mt-2 inline-block px-8 pb-4 leading-[1.5] md:pb-6">
            <Sparkles
              aria-hidden
              className="usk-spark absolute -left-1 top-1 size-5 md:size-6"
              style={{ color: "var(--zr-gold)" }}
              strokeWidth={1.5}
            />
            <Star
              aria-hidden
              className="usk-spark-2 absolute right-0 top-0 size-4"
              style={{ color: "var(--zr-gold)" }}
              strokeWidth={1.5}
            />
            <Sparkle
              aria-hidden
              className="usk-spark-3 absolute -left-2 bottom-2 size-4"
              style={{ color: "var(--zr-gold)" }}
              strokeWidth={1.5}
            />
            <Sparkles
              aria-hidden
              className="usk-spark-4 absolute -right-2 bottom-1 size-5"
              style={{ color: "var(--zr-gold)" }}
              strokeWidth={1.5}
            />
            <span className="usk-script font-script text-5xl font-bold sm:text-6xl md:text-7xl">
              nastaje magija.
            </span>
          </span>
        </h1>

        {/* Lead */}
        <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-ink">
          Uskoro otvaramo mesto za rukotvorine srpskih majstorica. Ostavite email
          i javićemo vam se čim krenemo.
        </p>

        {/* Progress bar */}
        <div className="mt-10 w-full max-w-md" aria-hidden>
          <div className="h-2 w-full overflow-hidden rounded-full bg-pink-light">
            <div
              className="usk-fill h-full rounded-full"
              style={{
                width: "68%",
                backgroundImage:
                  "linear-gradient(90deg, var(--zr-primary), var(--zr-gold))",
              }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-soft">
            <span>Izrada u toku</span>
            <span>uskoro</span>
          </div>
        </div>

        {/* Prijava */}
        {done ? (
          <div className="mt-9 flex w-full max-w-md items-center justify-center gap-2 rounded-full border border-line bg-surface px-5 py-3.5 text-sm font-semibold text-pink-dark">
            <Check className="size-4" style={{ color: "var(--zr-gold-deep)" }} />
            {MESSAGES[status as "subscribed" | "duplicate"]}
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mt-9 flex w-full max-w-md flex-col gap-3 sm:flex-row"
            noValidate
          >
            <label htmlFor="usk-email" className="sr-only">
              Email adresa
            </label>
            <input
              id="usk-email"
              type="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vasa@adresa.rs"
              className="min-w-0 flex-1 rounded-full border border-line bg-surface px-5 py-3.5 text-sm text-pink-dark outline-none transition-colors placeholder:text-ink-soft focus:border-pink"
            />

            {/* Honeypot — skriven od ljudi, vidljiv botovima. */}
            <input
              type="text"
              name="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="pointer-events-none absolute -left-[9999px] size-0 opacity-0"
            />

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-pink px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-pink-dark disabled:opacity-60"
            >
              {status === "loading" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Bell className="size-4" />
              )}
              Obavesti me
            </button>
          </form>
        )}

        {/* Nežna poruka o grešci / nevalidnom emailu (ispod forme). */}
        {(status === "invalid" || status === "error") && (
          <p className="mt-3 text-sm text-pink-dark" role="alert">
            {MESSAGES[status]}
          </p>
        )}

        {/* Sitna napomena */}
        <p className="mt-6 text-xs text-ink-soft">
          Bez spama. Samo jedno pismo, kad krenemo.
        </p>
      </div>
    </main>
  );
}
