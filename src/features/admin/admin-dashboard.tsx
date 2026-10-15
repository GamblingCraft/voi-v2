import {
  FileText,
  MessageSquare,
  Package,
  ShoppingCart,
} from "@deemlol/next-icons";

const summaryCards = [
  { label: "Товаров", helper: "Каталог пока пуст", icon: Package },
  { label: "Заказов", helper: "Новых заказов нет", icon: ShoppingCart },
  { label: "Обращений", helper: "Новых обращений нет", icon: MessageSquare },
  { label: "Публикаций", helper: "Материалы не добавлены", icon: FileText },
];

export function AdminDashboard() {
  const fieldClassName = "grid gap-2";
  const labelClassName = "text-xs font-semibold text-neutral-700";
  const controlClassName =
    "w-full rounded-xl border border-neutral-200 bg-white text-sm text-admin-ink transition-[border-color,box-shadow] focus:border-neutral-500 focus:outline-none focus:ring-3 focus:ring-neutral-900/7";

  return (
    <div className="grid gap-6">
      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Сводка"
      >
        {summaryCards.map(({ label, helper, icon: Icon }) => (
          <article
            key={label}
            className="flex min-h-32 gap-3.5 rounded-2xl border border-admin-border bg-white p-4 shadow-[0_0.5rem_2rem_rgb(18_24_32/0.03)]"
          >
            <span
              className="grid size-10.5 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-700"
              aria-hidden="true"
            >
              <Icon size={20} strokeWidth={1.7} />
            </span>
            <div>
              <p className="m-0 text-xs font-semibold text-neutral-600">
                {label}
              </p>
              <strong className="my-1.5 block text-2xl leading-none font-semibold">
                —
              </strong>
              <p className="m-0 text-xs leading-relaxed text-neutral-500">
                {helper}
              </p>
            </div>
          </article>
        ))}
      </section>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(18rem,0.8fr)]">
        <section className="rounded-2xl border border-admin-border bg-white p-5 shadow-[0_0.5rem_2rem_rgb(18_24_32/0.03)] sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="mb-1 text-[0.64rem] font-bold tracking-[0.12em] text-neutral-400">
                БЫСТРОЕ ДОБАВЛЕНИЕ
              </p>
              <h2 className="m-0 text-base font-semibold tracking-[-0.02em] sm:text-lg">
                Новая позиция каталога
              </h2>
            </div>
          </div>

          <form
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className={`${fieldClassName} sm:col-span-2`}>
              <label className={labelClassName} htmlFor="admin-product-name">
                Название
              </label>
              <input
                className={`${controlClassName} h-11 px-3.5`}
                id="admin-product-name"
                name="name"
                type="text"
                autoComplete="off"
              />
            </div>

            <div className={fieldClassName}>
              <label
                className={labelClassName}
                htmlFor="admin-product-category"
              >
                Категория
              </label>
              <select
                className={`${controlClassName} h-11 px-3.5`}
                id="admin-product-category"
                name="category"
                defaultValue=""
              >
                <option value="" disabled />
                <option value="formed">Формованный лёд</option>
                <option value="loose">Рассыпной лёд</option>
                <option value="block">Блочный лёд</option>
              </select>
            </div>

            <div className={fieldClassName}>
              <label className={labelClassName} htmlFor="admin-product-price">
                Цена
              </label>
              <input
                className={`${controlClassName} h-11 px-3.5`}
                id="admin-product-price"
                name="price"
                type="number"
                min="0"
                inputMode="decimal"
              />
            </div>

            <div className={fieldClassName}>
              <label className={labelClassName} htmlFor="admin-product-size">
                Размер
              </label>
              <input
                className={`${controlClassName} h-11 px-3.5`}
                id="admin-product-size"
                name="size"
                type="text"
                autoComplete="off"
              />
            </div>

            <div className={fieldClassName}>
              <label
                className={labelClassName}
                htmlFor="admin-product-packaging"
              >
                Фасовка
              </label>
              <input
                className={`${controlClassName} h-11 px-3.5`}
                id="admin-product-packaging"
                name="packaging"
                type="text"
                autoComplete="off"
              />
            </div>

            <div className={`${fieldClassName} sm:col-span-2`}>
              <label
                className={labelClassName}
                htmlFor="admin-product-description"
              >
                Описание
              </label>
              <textarea
                className={`${controlClassName} min-h-28 resize-y p-3.5`}
                id="admin-product-description"
                name="description"
                rows={5}
              />
            </div>

            <div className="flex flex-col justify-end gap-2.5 pt-1 sm:col-span-2 sm:flex-row">
              <button
                type="reset"
                data-admin-action
                className="min-h-11 cursor-pointer rounded-lg border border-admin-border bg-white px-3.5 text-neutral-700 transition-colors hover:bg-admin-bg sm:min-h-10"
              >
                Очистить
              </button>
              <button
                type="submit"
                data-admin-action
                className="min-h-11 cursor-pointer rounded-lg border border-neutral-950 bg-neutral-950 px-3.5 text-white transition-colors hover:bg-neutral-800 sm:min-h-10"
              >
                Сохранить черновик
              </button>
            </div>
          </form>
        </section>

        <section className="min-h-96 rounded-2xl border border-admin-border bg-white p-5 shadow-[0_0.5rem_2rem_rgb(18_24_32/0.03)] sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="mb-1 text-[0.64rem] font-bold tracking-[0.12em] text-neutral-400">
                СИСТЕМА
              </p>
              <h2 className="m-0 text-base font-semibold tracking-[-0.02em] sm:text-lg">
                Последние действия
              </h2>
            </div>
          </div>
          <div className="grid min-h-68 place-items-center rounded-xl border border-dashed border-neutral-300 text-center text-neutral-400">
            <div>
              <span className="text-xs font-medium">
                Здесь появится история изменений
              </span>
              <p className="mt-1.5 mb-0 text-xs">Пока действий нет</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
