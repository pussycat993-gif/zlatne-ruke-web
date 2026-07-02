import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/is-admin";

// Next 16: middleware se zove "proxy". Clerk-ov clerkMiddleware radi isto.
// Ovde radimo „signed-in" proveru za sve zaštićene rute, a za /admin dodatno
// EMAIL-based admin gejt (isti kriterijum kao is-admin.ts, NE role === 'admin').
// Autoritativnu proveru i dalje radi i admin/layout.tsx (odbrana u dubinu).

const isProtected = createRouteMatcher([
  "/admin(.*)",
  "/prodavac(.*)",
  "/profil(.*)",
]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

// „Coming soon" gejt (Part B): kada je MAINTENANCE_MODE='true', posetioci koji
// NISU admin vide samo /uskoro. Ove rute su UVEK dostupne (da admin može da se
// prijavi i da forma radi). _next/statika/favicon su već izuzeti u config.matcher.
const isMaintenanceAllowlisted = createRouteMatcher([
  "/uskoro",
  "/login(.*)", // Clerk sign-in (NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login)
  "/register(.*)", // Clerk sign-up (NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register)
  "/api/newsletter", // prijava sa /uskoro forme (Part C)
]);

export default clerkMiddleware(async (auth, req) => {
  // ── Maintenance gejt (aktivan samo kada je MAINTENANCE_MODE === 'true') ──
  // Kada je isključen, ceo blok se preskače → ponašanje je identično kao ranije.
  if (
    process.env.MAINTENANCE_MODE === "true" &&
    !isMaintenanceAllowlisted(req)
  ) {
    const { userId } = await auth();
    let admin = false;
    if (userId) {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      admin = isAdminEmail(user.primaryEmailAddress?.emailAddress);
    }
    // Ne-admin (uklj. neulogovane) → prepiši na /uskoro, URL ostaje isti.
    if (!admin) {
      const url = req.nextUrl.clone();
      url.pathname = "/uskoro";
      return NextResponse.rewrite(url);
    }
    // Admin: propušta dalje kroz normalnu logiku ispod (vidi ceo sajt).
  }

  // ── Postojeća zaštita (nepromenjena) ──
  if (isProtected(req)) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();

    // /admin: dozvoljeno samo ako je email u ADMIN_EMAILS. Uloga (kupac/
    // prodavac) je ovde nebitna — admin i prodavac mogu koegzistirati.
    if (isAdminRoute(req)) {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      if (!isAdminEmail(user.primaryEmailAddress?.emailAddress)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Sve sem Next internih fajlova i statike (osim ako su u query parametrima)
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Uvek na API/trpc rutama
    "/(api|trpc)(.*)",
  ],
};
