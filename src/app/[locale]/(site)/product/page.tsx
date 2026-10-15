import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { landingMetadata } from "@/features/content/landing-metadata";
import { ProductLanding } from "@/features/content/pages/product-landing";

type Props = { params: Promise<{ locale: string }> };
export function generateMetadata({ params }: Props) {
  return landingMetadata("product", params);
}
export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return <ProductLanding locale={locale} />;
}
