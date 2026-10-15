"use client";

import {
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import styles from "./inquiry-form.module.css";

const topics = [
  {
    id: "supply",
    label: "Обсудить поставку",
  },
  {
    id: "cooperation",
    label: "Сотрудничество",
  },
] as const;
export type InquiryTopic = (typeof topics)[number]["id"];

function InquiryFields({ topic }: { topic: InquiryTopic }) {
  return (
    <>
      <div className={styles.fields}>
        <label>
          Ваше имя <span>*</span>
          <input name="Имя" autoComplete="name" required maxLength={100} />
        </label>
        <label>
          {topic === "supply" ? "Телефон" : "Email"} <span>*</span>
          {topic === "supply" ? (
            <input
              name="Телефон"
              type="tel"
              autoComplete="tel"
              required
              minLength={10}
              maxLength={22}
              pattern="[+0-9\(\)\s\-]{10,22}"
              title="Номер телефона: цифры, пробелы, скобки, плюс или дефис"
              placeholder="+7 (___) ___-__-__"
            />
          ) : (
            <input
              name="Email"
              type="email"
              autoComplete="email"
              required
              maxLength={200}
            />
          )}
        </label>
        <label>
          {topic === "supply" ? "Заведение или событие" : "Компания"}
          <input
            name="Компания или проект"
            autoComplete="organization"
            maxLength={150}
            placeholder={
              topic === "supply"
                ? "Бар, ресторан, частный заказ"
                : "Название вашей компании"
            }
          />
        </label>
        {topic === "supply" ? (
          <label>
            Какой лёд нужен
            <select name="Вид льда" defaultValue="Нужна помощь с выбором">
              <option>Нужна помощь с выбором</option>
              <option>Формованный лёд</option>
              <option>Рассыпной лёд</option>
              <option>Блочный лёд</option>
            </select>
          </label>
        ) : (
          <label>
            Направление
            <select name="Направление" defaultValue="Регулярные поставки">
              <option>Регулярные поставки</option>
              <option>Продажа в торговой точке</option>
              <option>Кейтеринг и мероприятия</option>
              <option>Совместный проект</option>
              <option>Другое предложение</option>
            </select>
          </label>
        )}
        {topic === "supply" ? (
          <>
            <label>
              Объём
              <input
                name="Объём"
                maxLength={100}
                placeholder="Килограммы, упаковки или число гостей"
              />
            </label>
            <label>
              Дата получения
              <input name="Дата" type="date" />
            </label>
            <label className={styles.fullWidth}>
              Город и адрес
              <input
                name="Адрес"
                autoComplete="street-address"
                maxLength={250}
              />
            </label>
          </>
        ) : (
          <>
            <label>
              Город
              <input
                name="Город"
                autoComplete="address-level2"
                maxLength={100}
              />
            </label>
            <label>
              Телефон
              <input
                name="Телефон"
                type="tel"
                autoComplete="tel"
                maxLength={22}
              />
            </label>
          </>
        )}
      </div>
      <label className={styles.message}>
        {topic === "supply" ? "Детали заказа" : "Ваше предложение"}
        {topic === "cooperation" && <span> *</span>}
        <textarea
          name="Сообщение"
          rows={3}
          required={topic === "cooperation"}
          maxLength={2000}
          placeholder={
            topic === "supply"
              ? "Нужная форма, время получения, особенности подачи…"
              : "Формат сотрудничества, задачи и предполагаемые объёмы…"
          }
        />
      </label>
    </>
  );
}

function InquiryPanel({ topic }: { topic: InquiryTopic }) {
  const [preview, setPreview] = useState<string | null>(null);
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPreview(
      [
        `ВОЙ — ${topics.find((item) => item.id === topic)!.label}`,
        ...Array.from(data.entries())
          .filter(([, value]) => String(value).trim())
          .map(([key, value]) => `${key}: ${String(value).trim()}`),
      ].join("\n"),
    );
  }
  function download() {
    if (!preview) return;
    const url = URL.createObjectURL(
      new Blob([preview], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `voi-${topic}.txt`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <form
      className={styles.form}
      onSubmit={prepare}
      onChange={() => setPreview(null)}
    >
      <InquiryFields topic={topic} />
      <div className={styles.submitRow}>
        <button data-ui-action type="submit">
          Отправить
        </button>
      </div>
      <div aria-live="polite" aria-atomic="true">
        {preview && (
          <div className={styles.preview}>
            <h3>Обращение подготовлено</h3>
            <p>Не отправлено.</p>
            <pre>{preview}</pre>
            <button data-ui-action type="button" onClick={download}>
              Скачать заявку
            </button>
          </div>
        )}
      </div>
    </form>
  );
}

export function InquiryForm({
  initialTopic = "supply",
}: {
  initialTopic?: InquiryTopic;
}) {
  const id = useId();
  const [active, setActive] = useState<InquiryTopic>(initialTopic);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? topics.length - 1
          : event.key === "ArrowRight"
            ? (index + 1) % topics.length
            : event.key === "ArrowLeft"
              ? (index + topics.length - 1) % topics.length
              : null;
    if (next === null) return;
    event.preventDefault();
    setActive(topics[next].id);
    tabs.current[next]?.focus();
  }
  return (
    <div className={styles.inquiries}>
      <div className={styles.tabs} role="tablist" aria-label="Тема обращения">
        {topics.map((topic, index) => (
          <button
            key={topic.id}
            ref={(node) => {
              tabs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${id}-${topic.id}-tab`}
            aria-controls={`${id}-${topic.id}-panel`}
            aria-selected={active === topic.id}
            tabIndex={active === topic.id ? 0 : -1}
            onClick={() => setActive(topic.id)}
            onKeyDown={(event) => navigate(event, index)}
          >
            {topic.label}
          </button>
        ))}
      </div>
      {topics.map((topic) => (
        <div
          key={topic.id}
          role="tabpanel"
          id={`${id}-${topic.id}-panel`}
          aria-labelledby={`${id}-${topic.id}-tab`}
          hidden={active !== topic.id}
        >
          <InquiryPanel topic={topic.id} />
        </div>
      ))}
    </div>
  );
}
