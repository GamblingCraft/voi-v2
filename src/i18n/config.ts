export const localeConfig = {
  ru: {
    label: "Русский",
    shortLabel: "RU",
    htmlLang: "ru",
    direction: "ltr",
  },
  en: {
    label: "English",
    shortLabel: "EN",
    htmlLang: "en",
    direction: "ltr",
  },
} as const;

export type Locale = keyof typeof localeConfig;
export type TextDirection = (typeof localeConfig)[Locale]["direction"];

// Only the Russian version is published during the prototype phase.
export const locales: Locale[] = ["ru"];
export const defaultLocale: Locale = "ru";

export function hasLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocaleDirection(locale: Locale): TextDirection {
  return localeConfig[locale].direction;
}

export function localizePath(path: string, locale: Locale): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return normalizedPath;
  return normalizedPath === "/" ? `/${locale}` : `/${locale}${normalizedPath}`;
}
