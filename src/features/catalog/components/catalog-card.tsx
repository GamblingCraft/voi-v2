"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Droplet } from "@deemlol/next-icons";
import {
  productTitle,
  usageOptions,
  type CatalogProduct,
  type ProductWeight,
} from "../catalog-model";
import { ProductPurchase, ProductRating } from "./product-purchase";
import cardStyles from "./catalog-card.module.css";
export function CatalogCard({
  product,
  compact = false,
  horizontalMobile = false,
}: {
  product: CatalogProduct;
  compact?: boolean;
  horizontalMobile?: boolean;
}) {
  const [weight, setWeight] = useState<ProductWeight>(1);
  return (
    <article
      className={`${cardStyles.card} ${compact ? cardStyles.compactCard : ""} ${horizontalMobile ? cardStyles.horizontalMobile : ""}`}
    >
      <div className={cardStyles.cardTop}>
        <div className={cardStyles.productTags} aria-label="Теги товара">
          {product.usage.map((tag) => {
            const label = usageOptions.find(
              (option) => option.id === tag,
            )?.label;
            return label ? <span key={tag}>{label}</span> : null;
          })}
        </div>
        <ProductRating />
      </div>
      <h3>
        <Link href={product.catalogHref}>{productTitle(product, weight)}</Link>
      </h3>
      <Link
        href={product.catalogHref}
        className={cardStyles.productMedia}
        data-shape={product.id}
        aria-label={`Подробнее: ${product.name}`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={
            compact
              ? "260px"
              : "(max-width:600px) 90vw, (max-width:900px) 45vw, 35vw"
          }
        />
      </Link>
      {!compact && (
        <>
          <p className={cardStyles.description}>{product.description}</p>
          <dl className={cardStyles.cardSpecs}>
            <div>
              <dt>
                <Droplet size={16} aria-hidden="true" />
                Вода
              </dt>
              <dd>Байкальская</dd>
            </div>
            <div>
              <dt>
                <Package size={16} aria-hidden="true" />
                Упаковка
              </dt>
              <dd>{weight} кг</dd>
            </div>
          </dl>
        </>
      )}
      <ProductPurchase
        product={product}
        weight={weight}
        onWeightChange={setWeight}
      />
    </article>
  );
}
