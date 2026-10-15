import { notFound } from "next/navigation";
import { hasLocale, locales } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { getCatalogProducts } from "@/features/catalog/catalog.content";
import { ProductPage } from "@/features/catalog/product/product-page";

type Props = {
  params: Promise<{ locale: string; category: string; slug: string }>;
};
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getCatalogProducts().map((product) => ({
      locale,
      category: product.category,
      slug: product.slug,
    })),
  );
}
async function resolveProduct(params: Props["params"]) {
  const { locale, category, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const product = getCatalogProducts().find(
    (item) => item.slug === slug && item.category === category,
  );
  if (!product) notFound();
  return { locale, product };
}
export async function generateMetadata({ params }: Props) {
  const { locale, product } = await resolveProduct(params);
  return pageMetadata(
    locale,
    product.catalogHref,
    product.name,
    product.description,
  );
}
export default async function Page({ params }: Props) {
  const { locale, product } = await resolveProduct(params);
  return <ProductPage locale={locale} product={product} />;
}
