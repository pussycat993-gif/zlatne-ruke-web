import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = { title: "Registracija — Zlatne Ruke" };

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
      <div className="mb-8 text-center">
        <div className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink">
          Pridruži se
        </div>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-foreground">
          Otvori{" "}
          <span className="font-script font-normal text-pink">nalog</span>
        </h1>
      </div>
      <SignUp />
    </div>
  );
}
