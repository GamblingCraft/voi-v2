export type SiteEnvironment = { url?: string; indexable?: string };

/** Shared by HTTP headers, metadata, robots and sitemap. */
export function resolveSiteConfig(environment: SiteEnvironment) {
  const siteUrl = new URL(environment.url || "http://localhost:3000");
  if (
    !["http:", "https:"].includes(siteUrl.protocol) ||
    siteUrl.username ||
    siteUrl.password
  ) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be an HTTP(S) URL without credentials",
    );
  }
  const host = siteUrl.hostname;
  const local =
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "127.0.0.1" ||
    host === "[::1]";
  return {
    siteUrl,
    isIndexable:
      environment.indexable === "true" && Boolean(environment.url) && !local,
  };
}
export function getSiteConfig() {
  return resolveSiteConfig({
    url: process.env.NEXT_PUBLIC_SITE_URL,
    indexable: process.env.SITE_INDEXABLE,
  });
}
