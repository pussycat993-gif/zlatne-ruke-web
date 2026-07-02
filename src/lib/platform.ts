// Launch prekidač za platformu.
//
// Kontroliše ga env varijabla PLATFORM_LAUNCHED. Kada je "true", javni deo
// sajta skriva „demo" radnje (radnje bez vlasnika, shops.ownerId IS NULL) i
// njihove proizvode. Svaka druga vrednost (ili nepostavljena) = „nije lansirano"
// = trenutno ponašanje (demo radnje vidljive). Time je bezbedan podrazumevani
// slučaj „ništa se ne menja".
//
// Reverzibilno je isključivo preko env-a: postavi/obriši PLATFORM_LAUNCHED.
// Ne dira admin panel — admin uvek vidi sve radnje (vidi src/lib/db/admin.ts).
export function isPlatformLaunched(): boolean {
  return process.env.PLATFORM_LAUNCHED === "true";
}
