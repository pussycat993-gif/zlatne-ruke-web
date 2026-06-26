import type { Metadata } from "next";
import { DM_Sans, Caveat, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import "./globals.css";

// DM Sans — body + headings (--zr-font / --zr-font-display)
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Caveat — handwritten script accents (--zr-font-script)
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// JetBrains Mono — mono labels / eyebrows (--zr-font-mono)
const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Zlatne Ruke — rukotvorine žena iz Srbije",
  description:
    "Marketplace za rukotvorine žena iz Srbije. Svaki predmet ima ime, mesto i priču.",
  openGraph: {
    siteName: SITE_NAME,
    locale: "sr_RS",
    type: "website",
  },
};

// Postavlja temu pre prvog renderovanja da nema treperenja (FOUC).
// Čita izbor iz localStorage, pa pada na sistemsku preferencu.
const themeInit = `(function(){try{var t=localStorage.getItem('zr-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: "#C0637A" } }}>
      <html
        lang="sr"
        suppressHydrationWarning
        className={`${dmSans.variable} ${caveat.variable} ${jetBrainsMono.variable} h-full antialiased`}
      >
        <head>
          <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        </head>
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  );
}
