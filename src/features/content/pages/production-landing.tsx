import { FaqSection } from "@/features/content/components/faq-section";
import Image from "next/image";
import Link from "next/link";
import { EditorialHero } from "../components/editorial-hero";
import { SectionHeading } from "../components/section-heading";
import { CooperationSteps } from "../components/cooperation-steps";
import {
  productionHeroMedia,
  productionPrinciples,
  productionSteps,
  productionPackaging,
} from "../production.content";
import sharedStyles from "../styles/landing.module.css";
import styles from "../styles/editorial-layout.module.css";

export function ProductionLanding() {
  return (
    <main id="top" className={sharedStyles.page}>
      <EditorialHero
        label="Производство"
        media={productionHeroMedia}
        title={["ПРОИЗВОДСТВО ЛЬДА", "В ИРКУТСКЕ"]}
        introduction={["Вода Байкала", "Характер ВОЙ"]}
        description="Мы создаём лёд для баров, ресторанов и домашней подачи. Собственное производство, склады и логистика позволяют нам работать с продуктом на всём пути — от воды до поставки."
        href="#water"
        cta="О производстве"
      />
      <nav className={styles.sectionNav} aria-label="О производстве ВОЙ">
        <a href="#water">Основа продукта</a>
        <a href="#process">Как производим</a>
        <a href="#packaging">Упаковка</a>
        <a href="#storage">Хранение и доставка</a>
      </nav>
      <section
        id="water"
        className={sharedStyles.section}
        data-header-theme="light"
        aria-labelledby="water-title"
      >
        <SectionHeading
          label="Основа продукта"
          title={
            <span id="water-title">
              ПРОЗРАЧНЫЙ ЛЁД
              <br />
              ВЫРАЗИТЕЛЬНАЯ ПОДАЧА
            </span>
          }
        />
        <div className={styles.partnerLayout}>
          <div className={styles.partnerPhoto}>
            <Image
              src="/media/production/sections/33.webp"
              alt="Прозрачные кубы льда на производственной линии"
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
              className={styles.photo}
            />
          </div>
          <div className={styles.audiences}>
            {productionPrinciples.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
            <Link
              data-ui-action
              className={sharedStyles.button}
              href="/product"
            >
              О продукте
            </Link>
          </div>
        </div>
      </section>
      <section
        id="process"
        className={sharedStyles.section}
        data-header-theme="light"
        aria-labelledby="process-title"
      >
        <SectionHeading
          label="Путь продукта"
          title={
            <span id="process-title">
              ОТ ВОДЫ
              <br />
              ДО ГОТОВОЙ УПАКОВКИ
            </span>
          }
        />
        <CooperationSteps steps={productionSteps} />
      </section>
      <section
        id="packaging"
        className={sharedStyles.section}
        data-header-theme="light"
        aria-labelledby="packaging-title"
      >
        <SectionHeading
          label="Фасовка"
          title={
            <span id="packaging-title">
              РАБОЧИЙ ЗАПАС
              <br />
              ОСОБАЯ ПОДАЧА
            </span>
          }
        />
        <div className={styles.deliveryLayout}>
          <div className={styles.audiences}>
            {productionPackaging.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <p className={sharedStyles.lead}>
            Упаковка продолжает продукт: помогает работать с большим объёмом или
            становится частью сервировки.
          </p>
        </div>
        <div className={styles.photoPair}>
          <div>
            <Image
              src="/media/production/sections/55.webp"
              alt="Оборудование для упаковки льда"
              fill
              sizes="(max-width: 800px) 100vw, 56vw"
              className={styles.photo}
            />
          </div>
          <div>
            <Image
              src="/media/production/sections/66.webp"
              alt="Кубы льда в прозрачной упаковке"
              fill
              sizes="(max-width: 800px) 80vw, 36vw"
              className={styles.photo}
            />
          </div>
        </div>
      </section>
      <section
        id="storage"
        className={sharedStyles.section}
        data-header-theme="light"
        aria-labelledby="storage-title"
      >
        <SectionHeading
          label="После производства"
          title={
            <span id="storage-title">
              ХРАНИМ
              <br />
              КОМПЛЕКТУЕМ ДОСТАВЛЯЕМ
            </span>
          }
        />
        <div className={styles.deliveryLayout}>
          <div className={styles.deliveryPhoto}>
            <Image
              src="/media/production/sections/44.webp"
              alt="Готовый лёд на выходе из производственного оборудования"
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
              className={styles.photo}
            />
          </div>
          <div className={styles.deliveryContent}>
            <p className={sharedStyles.lead}>
              Готовая партия остаётся в нашей системе хранения и логистики до
              поставки.
            </p>
            <p>
              На собственных складах собираем заказы для заведений и событий.
              Производство, запас и отгрузка связаны одной командой — с ней
              можно обсудить и ассортимент, и график получения льда.
            </p>
            <div className={styles.productLink}>
              <Link
                data-ui-action
                className={sharedStyles.button}
                href="/cooperation"
              >
                Сотрудничество
              </Link>
            </div>
          </div>
        </div>
      </section>
      <FaqSection />
    </main>
  );
}
