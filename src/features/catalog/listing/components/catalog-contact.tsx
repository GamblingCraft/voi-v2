import Link from "next/link";
import contactStyles from "./catalog-contact.module.css";
import shellStyles from "../../styles/catalog-shell.module.css";

export function CatalogContact() {
  return (
    <section className={contactStyles.contact}>
      <h2>
        ПОДБЕРЁМ ЛЁД
        <br />
        ПОД ВАШУ ЗАДАЧУ
      </h2>
      <div>
        <p>
          Для заведения, события или личного заказа. Расскажите о формате подачи
          и объёме — обсудим подходящий вариант.
        </p>
        <Link
          data-ui-action
          className={shellStyles.actionLink}
          href="/contacts#inquiry"
        >
          Обсудить заказ
        </Link>
      </div>
    </section>
  );
}
