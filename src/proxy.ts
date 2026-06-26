import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Next 16: middleware se zove "proxy". Clerk-ov clerkMiddleware radi isto.
// Ovde radimo SAMO „signed-in" proveru (optimistički sloj). Pravu proveru
// uloge (admin/prodavac) radimo u layout-ima preko getCurrentRole().

const isProtected = createRouteMatcher([
  "/admin(.*)",
  "/prodavac(.*)",
  "/profil(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();
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
