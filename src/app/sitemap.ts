import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const sections = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/#hosting", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/#plans", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/#features", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/#faq", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/#contact", priority: 0.6, changeFrequency: "monthly" as const },
  ];

  return sections.map((s) => ({
    url: `${siteUrl}${s.path}`,
    lastModified: new Date(),
    changeFrequency: s.changeFrequency,
    priority: s.priority,
  }));
}
