"use client";
import { useEffect, useState, type RefObject } from "react";
import { usePathname } from "next/navigation";
export function useHeaderSurface(header: RefObject<HTMLElement | null>) {
  const pathname = usePathname();
  const [lightSurface, setLightSurface] = useState(false);
  useEffect(() => {
    let frame = 0;
    const sample = () => {
      frame = 0;
      const box = header.current?.getBoundingClientRect();
      if (!box) return;
      let el = document
        .elementsFromPoint(innerWidth / 2, box.top + box.height / 2)
        .find((item) => !header.current?.contains(item)) as
        HTMLElement | undefined;
      // Sample the section beneath the logo, skipping the fixed navigation itself.
      while (el) {
        if (
          el.matches(
            ".voi-hero,.voi-editorial-hero,.voi-journal-hero,.voi-footer-scene,.voi-about-hero",
          )
        ) {
          setLightSurface(false);
          return;
        }
        const rgba = getComputedStyle(el)
          .backgroundColor.match(/[\d.]+/g)
          ?.map(Number);
        if (rgba && (rgba.length === 3 || rgba[3] > 0.8)) {
          setLightSurface(
            rgba[0] * 0.2126 + rgba[1] * 0.7152 + rgba[2] * 0.0722 > 150,
          );
          return;
        }
        el = el.parentElement || undefined;
      }
      setLightSurface(false);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(sample);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const timer = window.setTimeout(schedule, 1000);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname, header]);
  return lightSurface;
}
