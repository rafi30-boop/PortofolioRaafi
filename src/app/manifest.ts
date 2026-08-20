import { getContent } from "@/lib/content";
import type { MetadataRoute } from "next";

export const revalidate = 0;

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { site } = await getContent();

  return {
    name: `${site.name} — ${site.role}`,
    short_name: site.firstName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}