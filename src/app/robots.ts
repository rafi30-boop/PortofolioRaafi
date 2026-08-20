import { getContent } from "@/lib/content";
import type { MetadataRoute } from "next";

export const revalidate = 0;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { site } = await getContent();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}