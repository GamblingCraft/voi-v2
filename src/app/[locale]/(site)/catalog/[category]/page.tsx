import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { iceFormats } from "@/features/catalog/ice-formats";
import { CatalogPage } from "@/features/catalog/catalog-page";
import type { CatalogQuery } from "@/features/catalog/catalog-selection";

type Props = {
  params: Promise<{ locale: string; category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
async function resolveCategory(params: Props["params"]) {
  const { locale, category } = await params;
  if (!hasLocale(locale)) notFound();
  const format = iceFormats.find((item) => item.id === category);
  if (!format) notFound();
  return { locale, format };
}
export async function generateMetadata({ params }: Props) {
  const { locale, format } = await resolveCategory(params);
  return pageMetadata(locale, format.href, format.name, format.description);
}
export default async function Page({ params, searchParams }: Props) {
  const { format } = await resolveCategory(params);
  const raw = await searchParams;
  const query: CatalogQuery = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [
      key,
      typeof value === "string" ? value : undefined,
    ]),
  );
  return <CatalogPage category={format.id} query={query} />;
}
