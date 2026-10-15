"use client";
import type { ReactNode } from "react";
import { Package } from "@deemlol/next-icons";
import { productTitle, type CatalogProduct } from "../../catalog-model";
import { ProductGallery } from "./product-gallery";
import {
  ProductPurchase,
  ProductRating,
} from "../../components/product-purchase";
import { useProductVariant } from "./product-variant";
import heroStyles from "./product-hero.module.css";
export function ProductHero({
  product,
  children,
}: {
  product: CatalogProduct;
  children: ReactNode;
}) {
  const { weight, setWeight } = useProductVariant();
  return (
    <div className={heroStyles.hero}>
      <ProductGallery product={product} />
      <div className={heroStyles.info}>
        <ProductRating />
        <h1>{productTitle(product, weight)}</h1>
        <p className={heroStyles.lead}>{product.description}</p>
        <dl className={heroStyles.facts}>
          <div>
            <dt>
              <Package size={18} aria-hidden="true" />
              Масса нетто
            </dt>
            <dd>{weight} кг</dd>
          </div>
        </dl>
        <ProductPurchase
          product={product}
          weight={weight}
          onWeightChange={setWeight}
        />
        {children}
      </div>
    </div>
  );
}
