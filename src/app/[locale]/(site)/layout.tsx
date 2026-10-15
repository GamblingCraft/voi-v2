import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteFooterPlacement } from "@/components/layout/site-footer-placement";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteShell } from "@/components/layout/site-shell";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

type PublicSiteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function PublicSiteLayout({
  children,
  params,
}: PublicSiteLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  const dictionary = await getDictionary(locale);

  return (
    <SiteShell
      locale={locale}
      navigationDictionary={dictionary.navigation}
      headerDictionary={dictionary.header}
    >
      <SiteHeader locale={locale} dictionary={dictionary.header} />
      {children}
      <SiteFooterPlacement>
        <SiteFooter locale={locale} dictionary={dictionary.footer} />
      </SiteFooterPlacement>
    </SiteShell>
  );
}
