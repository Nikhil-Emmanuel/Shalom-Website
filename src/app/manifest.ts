import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * Web app manifest-completes the icon set alongside icon.png and
 * apple-icon.png, and gives Android a proper name and theme colour when
 * someone adds the site to their home screen.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f3",
    theme_color: "#faf8f3",
    lang: "en-IN",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
