import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { CatalogIndex } from "@/features/catalog/catalog-index";
type Props = {
  params: Promise<{ locale: string }>;
};
export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return pageMetadata(
    locale,
    "/catalog",
    "Каталог байкальского льда",
    "Формованный, рассыпной и блочный лёд ВОЙ из байкальской воды. Подбор льда для напитков, охлаждения и событий.",
  );
}
export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return <CatalogIndex locale={locale} />;
}
