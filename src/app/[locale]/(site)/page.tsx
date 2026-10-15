import { HomePage } from "@/features/home/home-page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocalizedAlternates } from "@/i18n/metadata";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const dictionary = await getDictionary(locale);

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
    alternates: getLocalizedAlternates(locale),
  };
}

export default async function HomeRoute({ params }: HomePageProps) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  return <HomePage />;
}
