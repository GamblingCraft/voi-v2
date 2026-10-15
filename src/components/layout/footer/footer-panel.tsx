"use client";
import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { company } from "@/lib/company";
export function FooterPanel() {
  return (
    <div className="voi-footer-wrapper">
      <div className="voi-footer-panel">
        <span className="voi-footer-glass" aria-hidden="true" />
        <Link className="voi-footer-mark" href="/" aria-label="ВОЙ — главная">
          <BrandMark />
        </Link>
        <nav aria-label="О ВОЙ">
          <h3>ВОЙ</h3>
          <Link href="/product">О продукте</Link>
          <Link href="/production">Производство</Link>
          <Link href="/cooperation">Сотрудничество</Link>
        </nav>
        <nav aria-label="Форматы льда">
          <h3>Лёд ВОЙ</h3>
          <Link href="/catalog/formed">Формованный</Link>
          <Link href="/catalog/loose">Рассыпной</Link>
          <Link href="/catalog/block">Блочный</Link>
        </nav>
        <nav className="voi-footer-mainlinks" aria-label="Разделы">
          <Link href="/catalog">Каталог</Link>
          <Link href="/blog">Журнал</Link>
          <Link href="/contacts">Контакты</Link>
        </nav>
        <div className="voi-footer-contact">
          <small>ПОСТАВКИ И СОТРУДНИЧЕСТВО</small>
          <a href={company.phoneHref}>{company.phone}</a>
          <small>СОБСТВЕННОЕ ПРОИЗВОДСТВО</small>
          <span>Иркутск</span>
        </div>
        <div className="voi-footer-extra">
          <Link href="/cooperation">Стать партнёром</Link>
          <Link href="/contacts#inquiry">Обсудить поставку</Link>
        </div>
      </div>
      <div className="voi-footer-legal">
        <span>2026 © ВОЙ</span>
        <nav
          className="voi-footer-legal-links"
          aria-label="Правовая информация"
        >
          {["Конфиденциальность", "Соглашение", "Оферта"].map((label) => (
            <a
              key={label}
              href="#"
              aria-disabled="true"
              onClick={(event) => event.preventDefault()}
            >
              {label}
            </a>
          ))}
        </nav>
        <a href="#top">Наверх ↑</a>
      </div>
    </div>
  );
}
