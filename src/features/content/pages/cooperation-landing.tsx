import Image from "next/image";
import { CooperationSteps } from "../components/cooperation-steps";
import Link from "next/link";
import { company } from "@/lib/company";
import { InquirySection } from "../components/inquiry-section";
import { EditorialHero } from "../components/editorial-hero";
import { SectionHeading } from "../components/section-heading";
import { Faq } from "../components/faq";
import faqStyles from "../components/faq.module.css";
import {
  cooperationHeroMedia,
  cooperationAudiences,
  cooperationAdvantages,
  cooperationSteps,
  cooperationFaq,
} from "../cooperation.content";
import sharedStyles from "../styles/landing.module.css";
import styles from "../styles/editorial-layout.module.css";

export function CooperationLanding() {
  return (
    <main id="top" className={sharedStyles.page}>
      <EditorialHero
        label="Сотрудничество"
        media={cooperationHeroMedia}
        title={["ВАША ПОДАЧА", "НАШ ЛЁД"]}
        introduction={["Станьте партнёром", "ВОЙ"]}
        description="Премиальный лёд из байкальской воды для баров, ресторанов, отелей и событий. За продуктом ВОЙ стоят собственное производство в Иркутске, склады хранения и логистика. Объединяем их, чтобы работать с партнёрами напрямую — от выбора льда до поставки."
        href="#inquiry"
        cta="Начать сотрудничество"
      />
      <nav className={styles.sectionNav} aria-label="Сотрудничество с ВОЙ">
        <a href="#partners">Для кого</a>
        <a href="#advantages">Преимущества</a>
        <a href="#start">Как начать</a>
        <a href="#delivery">Где работаем</a>
      </nav>
      <section
        id="partners"
        className={sharedStyles.section}
        data-header-theme="light"
        aria-labelledby="partners-title"
      >
        <SectionHeading
          label="Форматы партнёрства"
          title={
            <span id="partners-title">
              ОТ БАРНОЙ СТОЙКИ
              <br />
              ДО БОЛЬШОГО СОБЫТИЯ
            </span>
          }
        />
        <div className={styles.partnerLayout}>
          <div className={styles.partnerPhoto}>
            <Image
              src="/media/cooperation/7.webp"
              alt="Подача ледяных кубов в бокал за барной стойкой"
              fill
              sizes="(max-width: 800px) 100vw, 48vw"
              className={styles.photo}
            />
          </div>
          <div className={styles.audiences}>
            {cooperationAudiences.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section
        id="advantages"
        className={sharedStyles.section}
        data-header-theme="light"
        aria-labelledby="advantages-title"
      >
        <SectionHeading
          label="Почему ВОЙ"
          title={
            <span id="advantages-title">
              ПРОДУКТ И ПОСТАВКА
              <br />В ОДНИХ РУКАХ
            </span>
          }
        />
        <div className={styles.advantages}>
          {cooperationAdvantages.map((item, index) => (
            <article key={item.title}>
              <span className={styles.index}>0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <div className={styles.photoPair}>
          <div>
            <Image
              src="/media/cooperation/2.webp"
              alt="Прозрачные кубы льда на производственной линии"
              fill
              sizes="(max-width: 800px) 100vw, 56vw"
              className={styles.photo}
            />
          </div>
          <div>
            <Image
              src="/media/cooperation/3.webp"
              alt="Лёд в транспортной упаковке ВОЙ"
              fill
              sizes="(max-width: 800px) 80vw, 36vw"
              className={styles.photo}
            />
          </div>
        </div>
        <div className={styles.productLink}>
          <Link data-ui-action href="/product" className={sharedStyles.button}>
            О нашем льде
          </Link>
        </div>
      </section>
      <section
        id="start"
        className={sharedStyles.section}
        data-header-theme="light"
        aria-labelledby="start-title"
      >
        <SectionHeading
          label="Начало работы"
          title={
            <span id="start-title">
              ОТ ЗНАКОМСТВА
              <br />
              ДО ПЕРВОЙ ПОСТАВКИ
            </span>
          }
        />
        <CooperationSteps steps={cooperationSteps} />
      </section>
      <section
        id="delivery"
        className={sharedStyles.section}
        data-header-theme="light"
        aria-labelledby="delivery-title"
      >
        <SectionHeading
          label="География и логистика"
          title={<span id="delivery-title">НАША БАЗА — ИРКУТСК</span>}
        />
        <div className={styles.deliveryLayout}>
          <div className={styles.deliveryPhoto}>
            <Image
              src="/media/cooperation/5.webp"
              alt="Партия ВОЙ в автомобиле перед отгрузкой"
              fill
              sizes="(max-width: 800px) 100vw, 56vw"
              className={styles.photo}
            />
          </div>
          <div className={styles.deliveryContent}>
            <p className={sharedStyles.lead}>
              Производим, храним и организуем поставки из Иркутска.
            </p>
            <p>
              Собственные склады и логистика позволяют связывать подготовку
              партии с её отгрузкой. Для регулярных заказов обсуждаем график под
              расход заведения, для события — поставку к согласованной дате.
            </p>
            <p>
              Партнёрство в другом городе начинается с обсуждения маршрута и
              объёма. Географию, сроки и условия подтверждаем для конкретной
              поставки.
            </p>
            <a className={styles.phone} href={company.phoneHref}>
              {company.phone}
            </a>
          </div>
        </div>
      </section>
      <section className={faqStyles.section} data-header-theme="light">
        <h2>
          О СОТРУДНИЧЕСТВЕ
          <br />В ДЕТАЛЯХ
        </h2>
        <Faq items={cooperationFaq} />
      </section>
      <InquirySection
        title={
          <>
            СТАНЬТЕ
            <br />
            ПАРТНЁРОМ ВОЙ
          </>
        }
      />
    </main>
  );
}
