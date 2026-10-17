import { dishes } from "@/lib/dishes";

export default function sitemap() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://addiseats.et").replace(/\/$/, "");
  const staticRoutes = [
    { url: `${siteUrl}/`, priority: 1, changeFrequency: "weekly" },
    { url: `${siteUrl}/menu`, priority: 0.8, changeFrequency: "daily" },
  ];
  const dishRoutes = dishes.map((dish) => ({
    url: `${siteUrl}/menu/${dish.id}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  return [...staticRoutes, ...dishRoutes].map((route) => ({
    ...route,
    lastModified: new Date(),
  }));
}
