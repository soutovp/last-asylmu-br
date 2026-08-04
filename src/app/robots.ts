import { MetadataRoute } from "next";

import { headers } from "next/headers";
 
export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get("host") || "lapbr.netlify.app";
  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/_next/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
