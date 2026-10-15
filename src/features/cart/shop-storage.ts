import type { ProductId, ProductWeight } from "../catalog/catalog-model";
import type { CartLine } from "./cart-model";

export type ShopState = { items: CartLine[]; viewed: ProductId[] };
export const emptyShopState: ShopState = { items: [], viewed: [] };

/** localStorage is untrusted input, including data written by older builds. */
export function decodeShopState(
  raw: string | null,
  isProductId: (value: unknown) => value is ProductId,
  weights: readonly ProductWeight[],
): ShopState {
  try {
    const data: unknown = JSON.parse(raw ?? "null");
    if (!data || typeof data !== "object") return emptyShopState;
    const { items: inputItems, viewed: inputViewed } = data as Record<
      string,
      unknown
    >;
    const items: CartLine[] = [];
    const variants = new Set<string>();
    for (const input of Array.isArray(inputItems)
      ? inputItems.slice(0, 30)
      : []) {
      if (!input || typeof input !== "object") continue;
      const { productId, weight, quantity } = input as Record<string, unknown>;
      if (
        !isProductId(productId) ||
        !weights.includes(weight as ProductWeight) ||
        typeof quantity !== "number" ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 99
      )
        continue;
      const variant = `${productId}:${weight}`;
      if (variants.has(variant)) continue;
      variants.add(variant);
      items.push({ productId, weight: weight as ProductWeight, quantity });
    }
    const viewed = [
      ...new Set(
        (Array.isArray(inputViewed) ? inputViewed : []).filter(isProductId),
      ),
    ].slice(0, 8);
    return { items, viewed };
  } catch {
    return emptyShopState;
  }
}
