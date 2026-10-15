"use client";
import { getCatalogProducts } from "@/features/catalog/catalog-data";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, X } from "@deemlol/next-icons";
import { localizePath, type Locale } from "@/i18n/config";
import {
  productTitle,
  previewPackPrice,
} from "@/features/catalog/catalog-model";
import { changeQuantity } from "../shop-store";
import type { CartLine } from "../cart-model";
import cartStyles from "./cart-preview.module.css";
export function CartPreviewItem({
  line,
  locale,
  onClose,
}: {
  line: CartLine;
  locale: Locale;
  onClose: () => void;
}) {
  const product = getCatalogProducts().find(
    (item) => item.id === line.productId,
  );
  if (!product) return null;
  return (
    <li key={`${line.productId}-${line.weight}`}>
      <Link
        className={cartStyles.photo}
        href={localizePath(product.catalogHref, locale)}
        onClick={onClose}
      >
        <Image src={product.image} alt={product.name} width={72} height={72} />
      </Link>
      <div className={cartStyles.itemInfo}>
        <Link
          href={localizePath(product.catalogHref, locale)}
          onClick={onClose}
        >
          {productTitle(product, line.weight)}
        </Link>
        <div className={cartStyles.itemBottom}>
          <div className={cartStyles.quantity}>
            <button
              type="button"
              aria-label={`Уменьшить количество: ${productTitle(product, line.weight)}`}
              onClick={() =>
                changeQuantity(product.id, line.weight, line.quantity - 1)
              }
            >
              <Minus size={14} aria-hidden="true" />
            </button>
            <span>{line.quantity}</span>
            <button
              type="button"
              disabled={line.quantity >= 99}
              aria-label={`Увеличить количество: ${productTitle(product, line.weight)}`}
              onClick={() =>
                changeQuantity(product.id, line.weight, line.quantity + 1)
              }
            >
              <Plus size={14} aria-hidden="true" />
            </button>
          </div>
          <strong>{line.quantity * previewPackPrice} ₽</strong>
        </div>
      </div>
      <button
        type="button"
        className={cartStyles.remove}
        aria-label={`Удалить: ${productTitle(product, line.weight)}`}
        onClick={() => changeQuantity(product.id, line.weight, 0)}
      >
        <X size={15} aria-hidden="true" />
      </button>
    </li>
  );
}
