import { localeConfig } from "@/i18n/config";

export function isCatalogPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  const localized = first && Object.hasOwn(localeConfig, first);
  return segments[localized ? 1 : 0] === "catalog";
}
