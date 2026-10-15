"use client";
import { IntrinsicImage } from "@/components/media/intrinsic-image";
import { useEffect, useRef, useState } from "react";
import { createPhotoCompositionMotion } from "./photo-composition-motion";
const photos = [
  "/media/cooperation/1.webp",
  "/media/production/hero/2.webp",
  "/media/product/hero/1.webp",
  "/media/cooperation/4.webp",
  "/media/production/sections/33.webp",
  "/media/cooperation/7.webp",
  "/media/products/sphere.png",
  "/media/products/cube.png",
  "/media/products/pack.png",
];
export function PhotoComposition() {
  const root = useRef<HTMLDivElement>(null),
    svg = useRef<SVGSVGElement>(null),
    list = useRef<HTMLUListElement>(null);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(max-width:1023px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!root.current || !svg.current || !list.current) return;
    const motion = createPhotoCompositionMotion({
      el: { value: root.current },
      svgEl: { value: svg.current },
      photosList: { value: list.current },
      getList: () => (mobile ? photos.slice(0, 6) : photos),
      isOuterOnly: () => mobile,
    });
    motion.mount();
    const reduced = matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (reduced) motion.destroy();
    return () => {
      if (!reduced) motion.destroy();
    };
  }, [mobile]);
  return (
    <div ref={root} className="voi-photo-composition">
      <svg ref={svg} viewBox="0 0 1236 1040" aria-hidden="true">
        <circle cx="618" cy="520" r="519.5" />
      </svg>
      <ul ref={list}>
        {(mobile ? photos.slice(0, 6) : photos).map((src, i) => (
          <li className="item" key={src}>
            <IntrinsicImage
              src={src}
              alt="Лёд и подача ВОЙ"
              style={{
                width: [175, 165, 200, 230, 270, 240, 190, 180, 180][i],
              }}
            />
          </li>
        ))}
      </ul>
      <IntrinsicImage
        className="voi-history-main"
        src="/media/products/pack.png"
        alt="Лёд ВОЙ"
      />
    </div>
  );
}
