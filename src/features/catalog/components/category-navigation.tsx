import Image from "next/image";
import Link from "next/link";
import { localizePath, type Locale } from "@/i18n/config";
import { iceFormats, type IceCategoryId } from "../ice-formats";
import styles from "./category-navigation.module.css";

export function CategoryNavigation({
  active,
  locale = "ru",
}: {
  active?: IceCategoryId;
  locale?: Locale;
}) {
  return (
    <nav
      id="discover"
      className={styles.categories}
      data-compact={active ? "true" : undefined}
      aria-label="Категории льда"
    >
      {iceFormats.map((category) => (
        <Link
          key={category.id}
          href={localizePath(category.href, locale)}
          className={styles.category}
          aria-current={active === category.id ? "page" : undefined}
        >
          <Image
            src={category.image}
            alt=""
            fill
            sizes="(max-width: 600px) 100vw, 33vw"
          />
          <span>{category.shortName}</span>
        </Link>
      ))}
    </nav>
  );
}
