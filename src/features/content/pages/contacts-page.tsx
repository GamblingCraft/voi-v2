import Link from "next/link";
import { BreadcrumbSeparator } from "@/components/ui/breadcrumb-separator";
import { company } from "@/lib/company";
import { ContactData } from "@/components/seo/contact-data";
import { InquirySection } from "../components/inquiry-section";
import { ContactMap } from "../components/contact-map";
import shared from "../styles/landing.module.css";
import styles from "./contacts-page.module.css";

export function ContactsPage() {
  const channels = [
    {
      name: "Telegram",
      value: company.telegramUrl,
      href: company.telegramUrl,
    },
    {
      name: "MAX",
      value: company.maxUrl,
      href: company.maxUrl,
    },
    {
      name: "Email",
      value: company.email,
      href: company.email ? `mailto:${company.email}` : null,
    },
  ];
  const requisites = [
    ["Наименование", company.legalName],
    ["ИНН", company.inn],
    ["ОГРН / ОГРНИП", company.ogrn],
    ["Адрес", company.streetAddress],
  ].filter(([, value]) => value);
  return (
    <main id="top" className={shared.page}>
      <ContactData />
      <nav className={styles.breadcrumb} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <BreadcrumbSeparator />
        <span aria-current="page">Контакты</span>
      </nav>
      <section
        className={styles.contactSection}
        aria-labelledby="contacts-heading"
      >
        <div className={styles.intro}>
          <h1 id="contacts-heading">
            Контакты
            <br />
            ВОЙ
          </h1>
        </div>
        <div className={styles.channels}>
          <div className={styles.phone}>
            <span>Поставки и сотрудничество</span>
            <a href={company.phoneHref}>{company.phone}</a>
          </div>
          {channels.length > 0 && (
            <div className={styles.messengers}>
              {channels.map((channel) => (
                <div className={styles.channel} key={channel.name}>
                  <h3>{channel.name}</h3>
                  {channel.href && (
                    <a href={channel.href}>
                      {channel.name === "Email" ? channel.value : "Написать"}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
          <a data-ui-action className={shared.textLink} href="#inquiry">
            Перейти к форме
          </a>
        </div>
      </section>
      <ContactMap />
      <InquirySection
        title={
          <>
            Давайте
            <br />
            обсудим
            <br />
            детали
          </>
        }
      />
      {requisites.length > 0 && (
        <section
          className={styles.requisites}
          aria-labelledby="company-heading"
        >
          <div>
            <h2 id="company-heading">Реквизиты</h2>
          </div>
          <dl>
            {requisites.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </main>
  );
}
