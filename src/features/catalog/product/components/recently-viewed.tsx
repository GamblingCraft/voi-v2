"use client";
import { useEffect } from "react";
import type { CatalogProduct } from "../../catalog-model";
import { rememberProduct, useRecentlyViewed } from "@/features/cart/shop-store";
import { CatalogCard } from "../../components/catalog-card";
import recommendationsStyles from "./product-recommendations.module.css";
export function RecentlyViewed({
  current,
  products,
}: {
  current: CatalogProduct;
  products: CatalogProduct[];
}) {
  const viewed = useRecentlyViewed();
  useEffect(() => {
    rememberProduct(current.id);
  }, [current.id]);
  const previous = viewed
    .filter((id) => id !== current.id)
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is CatalogProduct => Boolean(product));
  if (!previous.length) return null;
  return (
    <section className={recommendationsStyles.recommendations}>
      <h2>Вы смотрели</h2>
      <div className={recommendationsStyles.recommendationGrid}>
        {previous.map((product) => (
          <CatalogCard key={product.id} product={product} compact />
        ))}
      </div>
    </section>
  );
}
