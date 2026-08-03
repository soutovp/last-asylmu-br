import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://lastasylum.com.br";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/_next/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
