import type { CatalogProduct } from "./catalog-model";

export type CatalogQuery = {
  q?: string;
  shape?: string;
  usage?: string;
  sort?: string;
  product?: string;
};
type UsageOption = { id: string; label: string };
type ActiveFilter = { key: "shape" | "usage" | "q"; label: string };

// Pure selection logic: no rendering, browser state, or CMS dependency.
export function selectCatalogProducts(
  all: CatalogProduct[],
  usages: UsageOption[],
  query: CatalogQuery,
) {
  const selectedShape = all.find(
    (item) => item.id === (query.shape || query.product),
  );
  const selectedUsage = usages.find((item) => item.id === query.usage);
  const shape = selectedShape?.id ?? "all";
  const usage = selectedUsage?.id ?? "all";
  const q = (query.q || "").trim().slice(0, 200);
  const sort = query.sort === "name" ? "name" : "featured";
  const search = q.toLocaleLowerCase("ru");
  const products = all.filter(
    (item) =>
      (shape === "all" || item.id === shape) &&
      (usage === "all" || item.usage.includes(usage)) &&
      `${item.name} ${item.serving} ${item.description}`
        .toLocaleLowerCase("ru")
        .includes(search),
  );
  if (sort === "name")
    products.sort((a, b) => a.name.localeCompare(b.name, "ru"));

  const filters: ActiveFilter[] = [];
  if (selectedShape) filters.push({ key: "shape", label: selectedShape.form });
  if (selectedUsage && usage !== "all")
    filters.push({ key: "usage", label: selectedUsage.label });
  if (q) filters.push({ key: "q", label: `Поиск: ${q}` });
  return { shape, usage, q, sort, products, filters };
}

export type CatalogSelection = ReturnType<typeof selectCatalogProducts>;

export function catalogFilterHref(
  selection: Pick<CatalogSelection, "shape" | "usage" | "q" | "sort">,
  removedKey?: ActiveFilter["key"],
  categoryHref = "/catalog/formed",
) {
  const { shape, usage, q, sort } = selection;
  const params = new URLSearchParams({ shape, usage, q, sort });
  if (removedKey) params.delete(removedKey);
  return `${categoryHref}?${params.toString()}#discover`;
}
