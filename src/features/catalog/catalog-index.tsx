import Image from "next/image";
import Link from "next/link";
import { BreadcrumbSeparator } from "@/components/ui/breadcrumb-separator";
import { localizePath, type Locale } from "@/i18n/config";
import { CategoryNavigation } from "./components/category-navigation";
import { getCatalogProducts } from "./catalog.content";
import { CatalogCard } from "./components/catalog-card";
import shellStyles from "./styles/catalog-shell.module.css";
import styles from "./catalog-index.module.css";

export function CatalogIndex({ locale }: { locale: Locale }) {
  const products = getCatalogProducts();
  return (
    <main
      id="top"
      className={`${shellStyles.catalog} ${styles.page}`}
      data-header-theme="light"
    >
      <nav className={shellStyles.breadcrumb} aria-label="Хлебные крошки">
        <Link href={localizePath("/", locale)}>Главная</Link>
        <BreadcrumbSeparator />
        <span aria-current="page">Каталог</span>
      </nav>
      <header className={styles.heading}>
        <h1>
          ЛЁД ИЗ БАЙКАЛЬСКОЙ ВОДЫ<span>ДЛЯ НАПИТКОВ, КУХНИ И СОБЫТИЙ</span>
        </h1>
      </header>
      <CategoryNavigation locale={locale} />
      <section className={styles.selection} aria-labelledby="selection-title">
        <div className={styles.sectionHeading}>
          <h2 id="selection-title">Лёд для напитков</h2>
          <Link
            data-ui-action
            className={shellStyles.actionLink}
            href={localizePath("/catalog/formed", locale)}
          >
            Вся категория
          </Link>
        </div>
        <div className={styles.shopGrid}>
          {products
            .filter((product) => product.category === "formed")
            .map((product) => (
              <CatalogCard key={product.id} product={product} compact />
            ))}
          <aside className={`${styles.photoCard} ${styles.guide}`}>
            <Image
              src="/media/product/hero/1.webp"
              unoptimized
              alt=""
              fill
              sizes="(max-width: 1100px) 100vw, 33vw"
              className={styles.background}
            />
            <div className={styles.cardContent}>
              <h3>Журнал ВОЙ</h3>
              <p>Рецепты, формы льда и тонкости барной подачи.</p>
              <Link
                data-ui-action
                className={`${shellStyles.actionLink} ${shellStyles.actionLight}`}
                href={localizePath("/blog", locale)}
              >
                Читать журнал
              </Link>
            </div>
          </aside>
          {products
            .filter((product) => product.category !== "formed")
            .map((product) => (
              <CatalogCard key={product.id} product={product} compact />
            ))}
        </div>
      </section>
      <section
        className={styles.editorial}
        aria-label="О производстве и заказах"
      >
        <article className={styles.photoCard}>
          <Image
            src="/media/production/sections/44.webp"
            alt=""
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
            className={styles.background}
          />
          <div className={styles.cardContent}>
            <h2>
              Производим лёд
              <br />в Иркутске
            </h2>
            <p>Байкальская вода. Собственное производство. Лёд ВОЙ.</p>
            <Link
              data-ui-action
              className={`${shellStyles.actionLink} ${shellStyles.actionLight}`}
              href={localizePath("/production", locale)}
            >
              О производстве
            </Link>
          </div>
        </article>
        <article className={styles.photoCard}>
          <Image
            src="/media/cooperation/7.webp"
            alt=""
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
            className={styles.background}
          />
          <div className={styles.cardContent}>
            <h2>
              Лёд для вашего
              <br />
              заведения
            </h2>
            <p>Прямые поставки для баров, ресторанов и отелей.</p>
            <Link
              data-ui-action
              className={`${shellStyles.actionLink} ${shellStyles.actionLight}`}
              href={localizePath("/cooperation", locale)}
            >
              Сотрудничество
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
