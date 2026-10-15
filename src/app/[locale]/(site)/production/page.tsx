import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { landingMetadata } from "@/features/content/landing-metadata";
import { ProductionLanding } from "@/features/content/pages/production-landing";

type Props = { params: Promise<{ locale: string }> };
export function generateMetadata({ params }: Props) {
  return landingMetadata("production", params);
}
export default async function Page({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  return <ProductionLanding />;
}
