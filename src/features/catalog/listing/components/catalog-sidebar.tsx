import Link from "next/link";
import sidebarStyles from "./catalog-sidebar.module.css";
import shellStyles from "../../styles/catalog-shell.module.css";
import { CatalogFilters } from "./catalog-filters";
import type { CatalogProduct } from "../../catalog-model";
import { usageOptions } from "../../catalog-model";
import type { CatalogSelection } from "../../catalog-selection";
import type { IceFormat } from "../../ice-formats";

export function CatalogSidebar({
  all,
  selection,
  format,
}: {
  all: CatalogProduct[];
  selection: CatalogSelection;
  format: IceFormat;
}) {
  const { shape, usage, q, sort } = selection;
  return (
    <aside className={sidebarStyles.sidebar}>
      <CatalogFilters
        categoryHref={format.href}
        key={[shape, usage, q, sort].join(":")}
        shape={shape}
        usage={usage}
        q={q}
        sort={sort}
        shapes={all.map(({ id, form }) => ({ id, label: form }))}
        usages={usageOptions.filter(
          (option) =>
            option.id === "all" ||
            all.some((product) => product.usage.includes(option.id)),
        )}
      />
      <div className={sidebarStyles.sidebarHelp}>
        <h3>Какой лёд выбрать?</h3>
        <p>Сравните назначение форм и варианты подачи.</p>
        <Link data-ui-action className={shellStyles.actionLink} href="/product">
          Гид по льду{" "}
        </Link>
      </div>
    </aside>
  );
}
