"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ShoppingCart } from "@deemlol/next-icons";
import type { Locale } from "@/i18n/config";
import {
  useCartItems,
  cartQuantity,
  cartTotal,
} from "@/features/cart/shop-store";
import triggerStyles from "./header-cart-trigger.module.css";
const CartPreview = dynamic(() =>
  import("@/features/cart/components/cart-preview").then(
    (module) => module.CartPreview,
  ),
);
export function HeaderCartButton({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const items = useCartItems();
  const count = cartQuantity(items);
  const total = cartTotal(items);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  return (
    <div
      ref={root}
      className={triggerStyles.root}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        if (!root.current?.contains(document.activeElement)) setOpen(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          setOpen(false);
      }}
    >
      <button
        ref={trigger}
        className={triggerStyles.cartButton}
        data-has-items={count > 0 ? "true" : undefined}
        type="button"
        aria-label={`${label.replace("{count}", String(count))}. Сумма ${total} рублей`}
        aria-expanded={open}
        aria-controls="header-cart-preview"
        onClick={() => setOpen(true)}
      >
        <span className={triggerStyles.iconWrap}>
          <ShoppingCart size={22} strokeWidth={1.6} aria-hidden="true" />
          {count >= 1 && (
            <span className={triggerStyles.badge} aria-hidden="true">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </span>
      </button>
      {open && (
        <CartPreview
          locale={locale}
          onClose={() => {
            setOpen(false);
            trigger.current?.focus();
          }}
        />
      )}
    </div>
  );
}
