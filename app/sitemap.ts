import type { MetadataRoute } from "next";
import { biens } from "@/data/biens";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", priority: 1 },
    { path: "/biens/", priority: 0.9 },
    { path: "/proprietaires/", priority: 0.9 },
    { path: "/verification/", priority: 0.9 },
    { path: "/services/", priority: 0.8 },
    { path: "/contact/", priority: 0.7 },
    { path: "/a-propos/", priority: 0.6 },
    { path: "/mentions-legales/", priority: 0.2 },
  ];
  const now = new Date();
  return [
    ...pages.map((p) => ({
      url: `${siteUrl}${p.path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p.priority,
    })),
    ...biens.map((b) => ({
      url: `${siteUrl}/biens/${b.slug}/`,
      lastModified: new Date(b.date),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
