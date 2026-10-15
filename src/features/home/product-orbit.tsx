"use client";
import { IntrinsicImage } from "@/components/media/intrinsic-image";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { getCatalogProducts } from "@/features/catalog/catalog-data";
import { createProductOrbitMotion } from "./product-orbit-motion";
const products = getCatalogProducts();
export function ProductOrbit({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!root.current || matchMedia("(prefers-reduced-motion:reduce)").matches)
      return;
    const motion = createProductOrbitMotion({ value: root.current });
    let mounted = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !mounted) {
          mounted = true;
          motion.mount();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(root.current);
    return () => {
      observer.disconnect();
      if (mounted) motion.destroy();
    };
  }, []);
  return (
    <section ref={root} className="voi-product-orbit voi-paper">
      <div className="bg" aria-hidden="true">
        <div className="bg-wrap">
          {["outer-ring", "inner-ring", "inner-inner-ring"].map((ring) => (
            <div className="orbit-ring-wrap" key={ring}>
              <div className={ring}>
                {Array.from({ length: 14 }, (_, i) => (
                  <div
                    className="orbit-item"
                    key={i}
                    style={
                      {
                        "--index": i + 1,
                        "--degrees": (i * 360) / 14 + "deg",
                      } as CSSProperties
                    }
                  >
                    <div className="orbit-item-inner">
                      <div className="orbit-product-wrap">
                        <div className="orbit-product">
                          <IntrinsicImage
                            src={products[i % products.length].image}
                            alt=""
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="orbit-content">
        <div className="orbit-content-inner">{children}</div>
      </div>
    </section>
  );
}
