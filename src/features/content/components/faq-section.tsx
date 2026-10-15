import { Faq } from "./faq";
import { cooperationFaq } from "../cooperation.content";
import styles from "./faq.module.css";

export function FaqSection() {
  return (
    <section
      className={styles.section}
      data-header-theme="light"
      aria-label="Частые вопросы"
    >
      <h2>
        ЧАСТЫЕ
        <br />
        ВОПРОСЫ
      </h2>
      <Faq items={cooperationFaq} />
    </section>
  );
}
