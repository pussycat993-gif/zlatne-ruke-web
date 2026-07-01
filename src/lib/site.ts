// Bazni URL sajta - koristi se za canonical, OpenGraph i sitemap.
// Podesi NEXT_PUBLIC_SITE_URL u produkciji (npr. https://zlatneruke.rs).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://zlatneruke.rs"
).replace(/\/+$/, "");

export const SITE_NAME = "Zlatne Ruke";
