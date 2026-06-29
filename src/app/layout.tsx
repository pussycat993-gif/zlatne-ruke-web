// app/layout.tsx
import type { Metadata } from "next";
import { DM_Sans, Caveat } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Footer from "@/components/Footer";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"], // latin-ext zbog š, đ, č, ć, ž
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zlatne Ruke",
  description:
    "Katalog rukotvorina žena iz Srbije. Svaki predmet ima ime, mesto i priču.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="sr" className={`${dmSans.variable} ${caveat.variable}`}>
        <body>
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}