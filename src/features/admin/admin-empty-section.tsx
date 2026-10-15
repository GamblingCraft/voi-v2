import { Search } from "@deemlol/next-icons";
import { sectionTitles, type AdminSectionId } from "./admin-navigation";

type AdminEmptySectionProps = {
  section: Exclude<AdminSectionId, "overview">;
};

export function AdminEmptySection({ section }: AdminEmptySectionProps) {
  const title = sectionTitles[section];

  return (
    <section className="rounded-2xl border border-admin-border bg-white p-5 shadow-[0_0.5rem_2rem_rgb(18_24_32/0.03)] sm:p-7">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <label className="flex h-11 w-full items-center gap-2.5 rounded-xl border border-neutral-200 bg-white pl-3.5 text-neutral-400 transition-[border-color,box-shadow] focus-within:border-neutral-500 focus-within:ring-3 focus-within:ring-neutral-900/7 sm:max-w-md">
          <Search size={18} strokeWidth={1.8} aria-hidden="true" />
          <span className="sr-only">Поиск в разделе «{title}»</span>
          <input
            className="h-full min-w-0 flex-1 border-0 bg-transparent pr-3.5 text-admin-ink outline-none"
            type="search"
            autoComplete="off"
          />
        </label>
        <button
          type="button"
          data-admin-action
          className="min-h-11 cursor-pointer rounded-lg border border-neutral-950 bg-neutral-950 px-3.5 text-white transition-colors hover:bg-neutral-800 sm:min-h-10"
        >
          Добавить
        </button>
      </div>
      <div className="grid min-h-124 place-items-center rounded-xl border border-dashed border-neutral-300 text-center text-neutral-400">
        <div>
          <strong className="text-sm text-neutral-600">{title}</strong>
          <p className="mt-2 mb-0 text-xs">Раздел готов к подключению данных</p>
        </div>
      </div>
    </section>
  );
}
