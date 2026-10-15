"use client";

import { useRef, type ReactNode } from "react";
import { useProductScene } from "../hooks/use-product-scene";

/** Client boundary owns runtime only; page content is composed on the server. */
export function ProductScenes({
  children,
  hero,
  details,
  footer,
  showcases,
}: {
  children: ReactNode;
  hero: ReactNode;
  details: ReactNode;
  footer: ReactNode;
  showcases: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const entered = useProductScene(root);
  return (
    <div ref={root} className="product-root" id="top" data-snapshot-traverse>
      <div
        className="product"
        id="product-scene-overlay"
        aria-hidden="true"
        data-snapshot-traverse
      >
        <div id="mobile-scene" />
        <div id="product-scene" />
        <div id="bg" />
      </div>
      <div id="wrapper" className={entered ? "ready" : ""}>
        <div id="content" className={entered ? "" : "fix"}>
          <main>
            {hero}
            <div className="product">{children}</div>
            {details}
          </main>
          <div id="footer-stage">{footer}</div>
        </div>
      </div>
      <div className="product-showcases" data-snapshot-traverse>
        {showcases}
      </div>
    </div>
  );
}
