import Link from "next/link";
import headerStyles from "./catalog-header.module.css";
import shellStyles from "../../styles/catalog-shell.module.css";
import type { IceFormat } from "../../ice-formats";

export function CatalogHeader({ format }: { format: IceFormat }) {
  return (
    <header className={headerStyles.heading}>
      <h1>{format.name.toLocaleUpperCase("ru")}</h1>
      <div>
        <p>Из байкальской воды — для напитков, гастрономии и событий.</p>
        <Link data-ui-action className={shellStyles.actionLink} href="/product">
          Как выбрать лёд
        </Link>
      </div>
    </header>
  );
}
