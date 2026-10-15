import Link from "next/link";
import { BreadcrumbSeparator } from "@/components/ui/breadcrumb-separator";
import { getCatalogProducts, usageOptions } from "./catalog.content";
import { iceFormats, type IceCategoryId } from "./ice-formats";
import { selectCatalogProducts, type CatalogQuery } from "./catalog-selection";
import { CatalogHeader } from "./listing/components/catalog-header";
import { CategoryNavigation } from "./components/category-navigation";
import { CatalogContact } from "./listing/components/catalog-contact";
import { CatalogSidebar } from "./listing/components/catalog-sidebar";
import { CatalogResults } from "./listing/components/catalog-results";
import { CatalogCategoryInquiry } from "./listing/components/catalog-category-inquiry";
import shell from "./styles/catalog-shell.module.css";
import layoutStyles from "./styles/category-layout.module.css";

export function CatalogPage({
  query,
  category,
}: {
  query: CatalogQuery;
  category: IceCategoryId;
}) {
  const format = iceFormats.find((item) => item.id === category)!;
  const all = getCatalogProducts().filter(
    (product) => product.category === category,
  );
  const selection = selectCatalogProducts(all, usageOptions, query);
  return (
    <main id="top" className={shell.catalog} data-header-theme="light">
      <nav className={shell.breadcrumb} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <BreadcrumbSeparator />
        <Link href="/catalog">Каталог</Link>
        <BreadcrumbSeparator />
        <span aria-current="page">{format.name}</span>
      </nav>
      <CatalogHeader format={format} />
      <CategoryNavigation active={format.id} />
      <section
        className={layoutStyles.collection}
        aria-labelledby="collection-title"
      >
        {all.length > 0 ? (
          <div className={layoutStyles.shopLayout}>
            <CatalogSidebar all={all} selection={selection} format={format} />
            <CatalogResults selection={selection} format={format} />
          </div>
        ) : (
          <CatalogCategoryInquiry format={format} />
        )}
      </section>
      <CatalogContact />
    </main>
  );
}
