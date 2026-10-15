import { iceFormats } from "@/features/catalog/ice-formats";
import { getArticles } from "@/features/blog/articles";
import { getCatalogProducts } from "@/features/catalog/catalog.content";
import type { MetadataRoute } from "next";
import { locales, localizePath } from "@/i18n/config";
import { siteUrl, isIndexable } from "@/lib/seo";
const paths = [
  "/",
  "/product",
  "/production",
  "/cooperation",
  "/contacts",
  "/catalog",
  "/blog",
  ...getArticles().map((article) => `/blog/${article.slug}`),
  ...iceFormats.map((item) => item.href),
  ...getCatalogProducts().map((item) => item.catalogHref),
];
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable) return [];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: new URL(localizePath(path, locale), siteUrl).href,
      alternates: {
        languages: Object.fromEntries(
          locales.map((language) => [
            language,
            new URL(localizePath(path, language), siteUrl).href,
          ]),
        ),
      },
    })),
  );
}
