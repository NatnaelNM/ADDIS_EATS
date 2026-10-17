export default function robots() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://addiseats.et").replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/menu", "/menu/"],
        disallow: ["/cart", "/checkout", "/orders/", "/kitchen", "/signin", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
