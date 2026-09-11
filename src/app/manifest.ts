import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hades Cloud — Premium Minecraft Hosting",
    short_name: "Hades Cloud",
    description:
      "High-performance Minecraft hosting built for players, communities and serious server owners.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0d18",
    theme_color: "#0a0d18",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
