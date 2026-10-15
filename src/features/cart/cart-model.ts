import type { ProductId, ProductWeight } from "../catalog/catalog-model";
export type CartLine = {
  productId: ProductId;
  weight: ProductWeight;
  quantity: number;
};
export function addCartItem(
  items: CartLine[],
  productId: ProductId,
  weight: ProductWeight,
): CartLine[] {
  const exists = items.some(
    (item) => item.productId === productId && item.weight === weight,
  );
  return exists
    ? items.map((item) =>
        item.productId === productId && item.weight === weight
          ? { ...item, quantity: Math.min(99, item.quantity + 1) }
          : item,
      )
    : [...items, { productId, weight, quantity: 1 }];
}
export function setCartQuantity(
  items: CartLine[],
  productId: ProductId,
  weight: ProductWeight,
  quantity: number,
): CartLine[] {
  if (!Number.isFinite(quantity)) return items;
  return items
    .map((item) =>
      item.productId === productId && item.weight === weight
        ? { ...item, quantity: Math.max(0, Math.min(99, Math.trunc(quantity))) }
        : item,
    )
    .filter((item) => item.quantity > 0);
}
export function cartQuantity(items: CartLine[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
