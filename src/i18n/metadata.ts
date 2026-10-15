import type { Metadata } from "next";
import { defaultLocale, localizePath, locales, type Locale } from "./config";

export function getLocalizedAlternates(
  locale: Locale,
  path = "/",
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localizePath(path, locale),
    languages: {
      ...Object.fromEntries(
        locales.map((supportedLocale) => [
          supportedLocale,
          localizePath(path, supportedLocale),
        ]),
      ),
      "x-default": localizePath(path, defaultLocale),
    },
  };
}
