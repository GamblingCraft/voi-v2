import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: isIndexable
      ? {
          userAgent: "*",
          allow: "/",
          disallow: ["/admin", "/api", "/cart", "/checkout"],
        }
      : { userAgent: "*", disallow: "/" },
    ...(isIndexable ? { sitemap: new URL("/sitemap.xml", siteUrl).href } : {}),
  };
}
