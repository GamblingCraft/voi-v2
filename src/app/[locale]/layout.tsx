import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteFontClassName } from "@/styles/fonts";
import "lenis/dist/lenis.css";
import {
  getLocaleDirection,
  hasLocale,
  locales,
  type Locale,
} from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import "../globals.css";
import { isIndexable, siteUrl } from "@/lib/seo";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(localeParam)) notFound();

  const dictionary = await getDictionary(localeParam);

  return {
    metadataBase: siteUrl,
    title: {
      default: dictionary.metadata.title,
      template: `%s | ${dictionary.metadata.title}`,
    },
    description: dictionary.metadata.description,
    robots: {
      index: isIndexable,
      follow: isIndexable,
      googleBot: {
        index: isIndexable,
        follow: isIndexable,
        noimageindex: !isIndexable,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: localeParam } = await params;
  if (!hasLocale(localeParam)) notFound();

  const locale: Locale = localeParam;

  return (
    <html
      lang={locale}
      data-site="public"
      dir={getLocaleDirection(locale)}
      className={siteFontClassName}
    >
      <body>{children}</body>
    </html>
  );
}
