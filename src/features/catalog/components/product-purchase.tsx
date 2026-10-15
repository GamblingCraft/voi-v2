"use client";
import { useId } from "react";
import { ShoppingCart, Star, Minus, Plus } from "@deemlol/next-icons";
import {
  productWeights,
  previewPackPrice,
  previewRating,
  productTitle,
  type CatalogProduct,
  type ProductWeight,
} from "../catalog-model";
import {
  addToCart,
  changeQuantity,
  useCartItems,
} from "@/features/cart/shop-store";
import styles from "./product-purchase.module.css";
export function ProductRating() {
  return (
    <span
      className={styles.rating}
      aria-label={`Рейтинг ${previewRating} из 5`}
    >
      <Star
        size={16}
        fill="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span>{previewRating}</span>
    </span>
  );
}
export function ProductPurchase({
  product,
  weight,
  onWeightChange,
}: {
  product: CatalogProduct;
  weight: ProductWeight;
  onWeightChange: (weight: ProductWeight) => void;
}) {
  const groupId = useId();
  const items = useCartItems();
  const quantity =
    items.find(
      (item) => item.productId === product.id && item.weight === weight,
    )?.quantity ?? 0;
  return (
    <div className={styles.purchase}>
      <fieldset className={styles.weights}>
        <legend>Вес упаковки</legend>
        <div>
          {productWeights.map((value) => (
            <label key={value}>
              <input
                type="radio"
                name={groupId}
                checked={weight === value}
                onChange={() => onWeightChange(value)}
              />
              <span>{value} кг</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className={styles.buyRow}>
        {quantity > 0 ? (
          <div
            className={styles.quantity}
            role="group"
            aria-label={`Количество: ${productTitle(product, weight)}`}
          >
            <button
              type="button"
              aria-label={`Уменьшить количество: ${productTitle(product, weight)}`}
              onClick={() => changeQuantity(product.id, weight, quantity - 1)}
            >
              <Minus size={16} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <span aria-live="polite" aria-atomic="true">
              {quantity}
            </span>
            <button
              type="button"
              aria-label={`Увеличить количество: ${productTitle(product, weight)}`}
              disabled={quantity >= 99}
              onClick={() => changeQuantity(product.id, weight, quantity + 1)}
            >
              <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button
            data-ui-action
            className={styles.buy}
            type="button"
            onClick={() => addToCart(product.id, weight)}
            aria-label={`Купить ${productTitle(product, weight)} за ${previewPackPrice} рублей`}
          >
            <span>{previewPackPrice} ₽</span>
            <ShoppingCart size={19} strokeWidth={1.6} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
