"use client";
import { IntrinsicImage } from "@/components/media/intrinsic-image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { getCatalogProducts } from "@/features/catalog/catalog-data";
import { useProductStrip } from "../use-product-strip";
const products = getCatalogProducts();
const colors = ["#dce9ee", "#c6d7e0", "#e6edef", "#b7d7e4", "#d4ecf4"];
export function ProductStrip() {
  const rootRef = useRef<HTMLElement>(null);
  const [stripCopies, setStripCopies] = useState(2);
  useProductStrip(rootRef);
  useLayoutEffect(() => {
    const strip = rootRef.current;
    const track = strip?.querySelector<HTMLElement>(".voi-strip-track");
    if (!strip || !track) return;
    const measure = () => {
      const starts = track.querySelectorAll<HTMLElement>("[data-loop-start]");
      if (starts.length < 2) return;
      const period = starts[1].offsetLeft - starts[0].offsetLeft;
      if (period > 0)
        setStripCopies(Math.max(2, Math.ceil(strip.clientWidth / period) + 1));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(strip);
    measure();
    return () => observer.disconnect();
  }, []);
  return (
    <section className="voi-product-strip" ref={rootRef} aria-label="Лёд ВОЙ">
      <div className="voi-strip-track">
        {Array.from({ length: stripCopies }, () => products)
          .flat()
          .map((p, i) => (
            <Link
              href={p.catalogHref}
              key={`${p.id}-${i}`}
              data-loop-start={i % products.length === 0 ? "true" : undefined}
              tabIndex={i >= products.length ? -1 : undefined}
              aria-hidden={i >= products.length || undefined}
            >
              <div style={{ background: colors[i % colors.length] }}>
                <IntrinsicImage
                  src={p.image}
                  alt={i >= products.length ? "" : p.name}
                  loading="eager"
                  decoding="async"
                />
              </div>
              <h2>{p.form}</h2>
            </Link>
          ))}
      </div>
    </section>
  );
}
