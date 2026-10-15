"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import type { CatalogProduct } from "../../catalog-model";
import styles from "./product-gallery.module.css";

export function ProductGallery({ product }: { product: CatalogProduct }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  function go(index: number) {
    const next = (index + 3) % 3;
    track.current?.scrollTo({
      left: next * track.current.clientWidth,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  function media(index: number) {
    return index === 0 ? (
      <Image
        src={product.image}
        alt={product.name}
        fill
        sizes="(max-width:800px) 90vw, 50vw"
      />
    ) : (
      <span
        className={styles.placeholder}
        data-variant={index}
        role="img"
        aria-label={`Дополнительное изображение ${index}: плейсхолдер`}
      />
    );
  }
  return (
    <div className={styles.gallery}>
      <div
        className={styles.track}
        ref={track}
        aria-label="Галерея товара"
        role="region"
        tabIndex={0}
        onScroll={() => {
          if (track.current)
            setActive(
              Math.round(track.current.scrollLeft / track.current.clientWidth),
            );
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            go(active + (event.key === "ArrowRight" ? 1 : -1));
          }
        }}
      >
        {[0, 1, 2].map((index) => (
          <div className={styles.slide} key={index}>
            {media(index)}
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        <div className={styles.thumbnails}>
          {[0, 1, 2].map((index) => (
            <button
              type="button"
              key={index}
              aria-label={`Показать изображение ${index + 1}`}
              aria-pressed={index === active}
              onClick={() => go(index)}
            >
              {media(index)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
