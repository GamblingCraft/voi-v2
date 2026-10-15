import Link from "next/link";
import { iceFormats } from "@/features/catalog/ice-formats";
import { productFaq } from "@/features/content/landing.content";
import { Faq } from "@/features/content/components/faq";
import faqStyles from "@/features/content/components/faq.module.css";
import shared from "@/features/content/styles/landing.module.css";
import styles from "./product-guide.module.css";

export function ProductGuide() {
  return (
    <div className={shared.page}>
      <section className={styles.guide} aria-labelledby="ice-choice-heading">
        <div className={styles.heading}>
          <p>Выбор льда</p>
          <h2 id="ice-choice-heading">
            Сначала задача
            <br />
            Затем форма
          </h2>
        </div>
        <div className={styles.formats}>
          {iceFormats.map((format) => (
            <Link key={format.id} href={format.href}>
              <h3>{format.name}</h3>
              <p>{format.description}</p>
              <span>Смотреть в каталоге</span>
            </Link>
          ))}
        </div>
      </section>
      <section className={faqStyles.section} data-header-theme="light">
        <h2>
          Перед
          <br />
          заказом
        </h2>
        <Faq items={productFaq} />
      </section>
    </div>
  );
}
