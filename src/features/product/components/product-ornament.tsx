"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { voiPatternPaths } from "./voi-pattern-paths";

const tileHeight = 746.208;
export function ProductOrnament() {
  const root = useRef<HTMLDivElement>(null);
  const [viewHeight, setViewHeight] = useState(tileHeight);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const section = node.closest<HTMLElement>(".voi-ornament-scene")!;
    const measure = () => {
      const svg = node.querySelector("svg");
      if (!svg) return;
      const { width, height } = svg.getBoundingClientRect();
      if (width > 0 && height > 0)
        setViewHeight(Math.round((height / width) * 337));
    };
    const resize = new ResizeObserver(measure);
    resize.observe(section);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      resize.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        const paths = Array.from(node.querySelectorAll<SVGPathElement>("path"));
        const rows = paths.map((path) => {
          const tile = Number(
            path.parentElement?.getAttribute("data-tile") ?? 0,
          );
          const y = path.getBBox().y + tile * tileHeight;
          return { path, start: Math.max(0, y / viewHeight), previous: "" };
        });
        const state = { progress: 0 };
        const drawWindow = 160 / Math.max(1, node.clientHeight);
        gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
        const paint = () => {
          for (const row of rows) {
            const offset = (
              1 -
              Math.max(
                0,
                Math.min(1, (state.progress - row.start) / drawWindow),
              )
            ).toFixed(3);
            if (offset !== row.previous) {
              row.path.style.strokeDashoffset = offset;
              row.previous = offset;
            }
          }
        };
        // Read the live, transformed position: ScrollSmoother is initialized
        // asynchronously and can invalidate an earlier ScrollTrigger origin.
        const section = node.closest<HTMLElement>(".voi-ornament-scene")!;
        const tick = () => {
          if (
            document.hidden ||
            document.body.classList.contains("is-menu-open")
          )
            return;
          // Draw as the actual story emerges, not while the cloud pass hides it.
          const travel =
            innerHeight * 0.5 - section.getBoundingClientRect().top;
          // One screen pixel of scroll advances one pixel down the ornament.
          // ScrollSmoother already smooths the measured position; do not ease it twice.
          const target = Math.max(
            0,
            Math.min(1 + drawWindow, travel / Math.max(1, node.clientHeight)),
          );
          if (Math.abs(target - state.progress) < 0.0001) return;
          state.progress = target;
          node.dataset.drawProgress = state.progress.toFixed(3);
          paint();
        };
        gsap.ticker.add(tick);
        paint();
        return () => gsap.ticker.remove(tick);
      }, node);
      return () => context.revert();
    });
    return () => media.revert();
  }, [viewHeight]);
  return (
    <div ref={root} className="voi-product-ornament" aria-hidden="true">
      {["left", "right"].map((side) => (
        <svg
          key={side}
          className={`voi-pattern-${side}`}
          viewBox={`0 0 337 ${viewHeight}`}
          fill="none"
          preserveAspectRatio="xMidYMin meet"
        >
          {Array.from(
            { length: Math.ceil(viewHeight / tileHeight) },
            (_, tile) => (
              <g
                key={tile}
                data-tile={tile}
                transform={`translate(0 ${tile * tileHeight})`}
              >
                {voiPatternPaths.map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    pathLength={1}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </g>
            ),
          )}
        </svg>
      ))}
    </div>
  );
}
