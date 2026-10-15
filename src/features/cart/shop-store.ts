"use client";
import { useSyncExternalStore } from "react";
import {
  productIds,
  productWeights,
  previewPackPrice,
  type ProductId,
  type ProductWeight,
} from "../catalog/catalog-model";
import {
  addCartItem,
  setCartQuantity,
  cartQuantity,
  type CartLine,
} from "./cart-model";
import {
  decodeShopState,
  emptyShopState,
  type ShopState,
} from "./shop-storage";

let state = emptyShopState;
let hydrated = false;
const key = "voi-shop-v1";
const listeners = new Set<() => void>();
const ids = new Set<string>(productIds);
const decode = (raw: string | null) =>
  decodeShopState(
    raw,
    (value): value is ProductId => typeof value === "string" && ids.has(value),
    productWeights,
  );
function emit() {
  listeners.forEach((listener) => listener());
}
function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    state = decode(localStorage.getItem(key));
  } catch {
    /* Keep in-memory state when browser storage is unavailable. */
  }
}
function storageChanged(event: StorageEvent) {
  if (event.storageArea !== localStorage) return;
  if (event.key === key || event.key === null) {
    state = decode(event.key === null ? null : event.newValue);
    emit();
  }
}
function commit(next: ShopState) {
  state = next;
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    /* The cart remains usable if storage is unavailable. */
  }
  emit();
}
const subscribe = (listener: () => void) => {
  if (listeners.size === 0) {
    // Re-read after a period without subscribers: another tab may have changed it.
    hydrated = false;
    hydrate();
    window.addEventListener("storage", storageChanged);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0)
      window.removeEventListener("storage", storageChanged);
  };
};
const getItems = () => state.items;
const getViewed = () => state.viewed;
const getServerItems = () => emptyShopState.items;
const getServerViewed = () => emptyShopState.viewed;
export function useCartItems() {
  return useSyncExternalStore(subscribe, getItems, getServerItems);
}
export function useRecentlyViewed() {
  return useSyncExternalStore(subscribe, getViewed, getServerViewed);
}
export function addToCart(productId: ProductId, weight: ProductWeight) {
  hydrate();
  commit({ ...state, items: addCartItem(state.items, productId, weight) });
}
export function changeQuantity(
  productId: ProductId,
  weight: ProductWeight,
  quantity: number,
) {
  hydrate();
  commit({
    ...state,
    items: setCartQuantity(state.items, productId, weight, quantity),
  });
}
export function rememberProduct(productId: ProductId) {
  hydrate();
  if (state.viewed[0] !== productId)
    commit({
      ...state,
      viewed: [
        productId,
        ...state.viewed.filter((id) => id !== productId),
      ].slice(0, 8),
    });
}
export function cartTotal(items: CartLine[]) {
  return cartQuantity(items) * previewPackPrice;
}
export { cartQuantity };
