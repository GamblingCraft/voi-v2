"use client";
import Link from "next/link";
import { X } from "@deemlol/next-icons";
import { localizePath, type Locale } from "@/i18n/config";
import { useCartItems, cartQuantity, cartTotal } from "../shop-store";
import { CartPreviewItem } from "./cart-preview-item";
import cartStyles from "./cart-preview.module.css";
export function CartPreview({
  locale,
  onClose,
}: {
  locale: Locale;
  onClose: () => void;
}) {
  const items = useCartItems();
  const count = cartQuantity(items);
  const total = cartTotal(items);
  return (
    <section
      id="header-cart-preview"
      className={cartStyles.preview}
      aria-label="Корзина"
    >
      <div className={cartStyles.content}>
        <div className={cartStyles.previewTitle}>
          <h2>Корзина</h2>
          <button type="button" aria-label="Закрыть корзину" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        {items.length === 0 ? (
          <div className={cartStyles.empty}>
            <p>В корзине пока нет товаров</p>
            <Link href={localizePath("/catalog", locale)} onClick={onClose}>
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <>
            <ul className={cartStyles.items}>
              {items.map((line) => (
                <CartPreviewItem
                  key={`${line.productId}-${line.weight}`}
                  line={line}
                  locale={locale}
                  onClose={onClose}
                />
              ))}
            </ul>
            <div className={cartStyles.summary}>
              <span>Упаковок: {count}</span>
              <strong>{total.toLocaleString("ru-RU")} ₽</strong>
            </div>
            <button
              data-ui-action
              type="button"
              className={cartStyles.checkout}
              disabled
            >
              Оформить заказ
            </button>
          </>
        )}
      </div>
    </section>
  );
}
