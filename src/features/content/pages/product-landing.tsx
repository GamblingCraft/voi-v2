import { SiteFooter } from "@/components/layout/site-footer";
import { Product } from "@/features/product/product";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getCatalogProducts } from "@/features/catalog/catalog.content";

export async function ProductLanding({ locale }: { locale: Locale }) {
  const dictionary = await getDictionary(locale);
  return (
    <Product
      products={getCatalogProducts()}
      footer={<SiteFooter locale={locale} dictionary={dictionary.footer} />}
    />
  );
}
