import { getContent } from "@/lib/content";
import type { MetadataRoute } from "next";

export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { site, projects, certificates } = await getContent();

  const projectUrls: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${site.url}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const certificateUrls: MetadataRoute.Sitemap = certificates.map(
    (certificate) => ({
      url: `${site.url}/certificates/${certificate.slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    })
  );

  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projectUrls,
    ...certificateUrls,
  ];
}