import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Prijava - Zlatne Ruke",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
      <div className="mb-8 text-center">
        <div className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink">
          Dobrodošla nazad
        </div>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-foreground">
          Uđi u svoj{" "}
          <span className="font-script font-normal text-pink">kutak</span>
        </h1>
      </div>
      <SignIn />
    </div>
  );
}
