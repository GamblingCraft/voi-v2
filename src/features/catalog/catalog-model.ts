import type { IceCategoryId } from "./ice-formats";

export const productIds = [
  "cube",
  "sphere",
  "cylinder",
  "loose",
  "block",
] as const;
export type ProductId = (typeof productIds)[number];
export type CatalogProduct = {
  id: ProductId;
  category: IceCategoryId;
  name: string;
  form: string;
  image: string;
  packImage: string;
  description: string;
  serving: string;
  usage: string[];
  tags: string[];
  occasion: string;
  glass: string;
  catalogHref: string;
  slug: string;
  code: string;
};

export const usageOptions = [
  { id: "all", label: "Любая подача" },
  { id: "cocktails", label: "Коктейли" },
  { id: "spirits", label: "Крепкие напитки" },
  { id: "longdrinks", label: "Высокая подача" },
  { id: "cooling", label: "Охлаждение и сервис" },
  { id: "carving", label: "Ледяная резьба и шоу" },
];

// Temporary prototype values explicitly requested by the user; not review data.
export const productWeights = [1, 2, 3] as const;
export type ProductWeight = (typeof productWeights)[number];
export const previewPackPrice = 100;
export const previewRating = 5;
export function productTitle(product: CatalogProduct, weight: number) {
  return `${product.name} ${weight} кг`;
}
