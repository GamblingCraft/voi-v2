import { BreadcrumbSeparator } from "@/components/ui/breadcrumb-separator";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { BreadcrumbData } from "@/components/seo/breadcrumb-data";
import { getCatalogProducts, type CatalogProduct } from "../catalog.content";
import { ProductDetails } from "./components/product-details";
import { RecentlyViewed } from "./components/recently-viewed";
import { getProductArticles } from "@/features/blog/articles";
import { CatalogCard } from "../components/catalog-card";
import { iceFormats } from "../ice-formats";
import shellStyles from "../styles/catalog-shell.module.css";
import pageStyles from "../styles/product-page.module.css";
import recommendationsStyles from "./components/product-recommendations.module.css";
export function ProductPage({
  product,
}: {
  product: CatalogProduct;
  locale: Locale;
}) {
  const products = getCatalogProducts();
  const format = iceFormats.find((item) => item.id === product.category)!;
  return (
    <main
      id="top"
      className={`${shellStyles.catalog} ${pageStyles.page}`}
      data-header-theme="light"
    >
      <BreadcrumbData
        items={[
          { name: "ВОЙ", path: "/" },
          { name: "Каталог", path: "/catalog" },
          { name: format.name, path: format.href },
          { name: product.name, path: product.catalogHref },
        ]}
      />
      <nav className={shellStyles.breadcrumb} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <BreadcrumbSeparator />
        <Link href="/catalog">Каталог</Link>
        <BreadcrumbSeparator />
        <Link href={format.href}>{format.name}</Link>
        <BreadcrumbSeparator />
        <span aria-current="page">{product.form}</span>
      </nav>
      <ProductDetails
        key={product.id}
        product={product}
        articles={getProductArticles(product)}
      />
      <section className={recommendationsStyles.recommendations}>
        <h2>Похожие товары</h2>
        <div className={recommendationsStyles.recommendationGrid}>
          {products
            .filter((item) => item.id !== product.id)
            .map((item) => (
              <CatalogCard key={item.id} product={item} compact />
            ))}
        </div>
      </section>
      <RecentlyViewed current={product} products={products} />
    </main>
  );
}
