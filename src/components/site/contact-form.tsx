"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";

// Kontakt forma — za sada bez slanja na server (povezivanje sa email/bazom
// dolazi kasnije). Po slanju prikazuje lokalnu potvrdu.
export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-3xl border border-line-soft bg-cream px-6 py-12 text-center">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-surface text-pink">
          <Icon name="check" size={28} />
        </span>
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          Poruka poslata
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink">
          Hvala što si nam pisala. Javljamo se u najkraćem roku.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-pink-dark outline-none placeholder:text-ink-soft focus:border-pink";
  const labelClass =
    "mb-2 block font-mono text-xs font-semibold uppercase tracking-wider text-pink-dark";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="rounded-3xl border border-line-soft bg-surface p-6 md:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="cf-name">
            Ime i prezime
          </label>
          <input
            id="cf-name"
            name="name"
            required
            placeholder="Tvoje ime"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="cf-email">
            Email
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            placeholder="ti@primer.rs"
            className={inputClass}
          />
        </div>
      </div>
      <div className="mt-4">
        <label className={labelClass} htmlFor="cf-message">
          Poruka
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          placeholder="Kako možemo da pomognemo?"
          className={`${inputClass} resize-y`}
        />
      </div>
      <Button type="submit" size="lg" className="mt-6 h-11 rounded-full px-7 text-sm">
        Pošalji poruku
      </Button>
    </form>
  );
}
