import "server-only";
import type { Metadata } from "next";
import { localizePath, type Locale } from "@/i18n/config";
import { getLocalizedAlternates } from "@/i18n/metadata";
import { getSiteConfig } from "./site-config";

export const { siteUrl, isIndexable } = getSiteConfig();
export function pageMetadata(
  locale: Locale,
  path: string,
  title: string,
  description: string,
): Metadata {
  return {
    title,
    description,
    alternates: getLocalizedAlternates(locale, path),
    openGraph: {
      type: "website",
      siteName: "ВОЙ",
      title,
      description,
      locale: locale === "ru" ? "ru_RU" : "en_US",
      url: localizePath(path, locale),
    },
    twitter: { card: "summary", title, description },
  };
}
