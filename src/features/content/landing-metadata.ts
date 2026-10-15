import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { getLandingContent, type LandingSlug } from "./landing.content";

export async function landingMetadata(
  slug: LandingSlug,
  params: Promise<{ locale: string }>,
) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const content = getLandingContent(slug);
  return pageMetadata(
    locale,
    `/${slug}`,
    content.seoTitle,
    content.description,
  );
}
