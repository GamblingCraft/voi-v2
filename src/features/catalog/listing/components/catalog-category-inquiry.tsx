import Link from "next/link";
import categoryStyles from "./catalog-category-inquiry.module.css";
import shellStyles from "../../styles/catalog-shell.module.css";
import type { IceFormat } from "../../ice-formats";

export function CatalogCategoryInquiry({ format }: { format: IceFormat }) {
  return (
    <div className={categoryStyles.formatFeature}>
      <div
        className={categoryStyles.formatMedia}
        data-format={format.id}
        role="img"
        aria-label={`Место для фотографии: ${format.name}`}
      />
      <div className={categoryStyles.formatContent}>
        <h2 id="collection-title">
          {format.id === "loose" ? (
            <>
              Для кухни,
              <br />
              бара и сервиса
            </>
          ) : (
            <>
              Для подачи
              <br />и ледяной резьбы
            </>
          )}
        </h2>
        <p>
          {format.id === "loose"
            ? "Рассыпной лёд в зип-упаковке. Расскажите, для чего нужен лёд и какой объём планируете использовать."
            : "Блочный лёд для работы с формой: от гастрономической подачи до оформления событий. Расскажите о вашей идее и нужном объёме."}
        </p>
        <p className={categoryStyles.muted}>
          Размеры, фасовку и стоимость согласуем при обращении.
        </p>
        <Link
          data-ui-action
          className={shellStyles.button}
          href="/contacts#inquiry"
        >
          Обсудить поставку
        </Link>
      </div>
    </div>
  );
}
