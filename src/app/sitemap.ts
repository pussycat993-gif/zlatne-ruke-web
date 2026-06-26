import type { MetadataRoute } from "next";
import { getAllSaveti } from "@/lib/saveti";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/katalog",
    "/radnje",
    "/saveti",
    "/o-nama",
    "/postani-prodavac",
  ].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: new Date(),
  }));

  const savetiRoutes = getAllSaveti().map((a) => ({
    url: `${SITE_URL}/saveti/${a.slug}`,
    lastModified: a.date ? new Date(a.date) : new Date(),
  }));

  return [...staticRoutes, ...savetiRoutes];
}
