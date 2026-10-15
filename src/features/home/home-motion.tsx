"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useHomeSmoothScroll } from "./use-home-smooth-scroll";
export function HomeMotion({ children }: { children: ReactNode }) {
  useHomeSmoothScroll();
  const rootRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from(".voi-hero-background", {
          scale: 1.05,
          opacity: 0,
          duration: 2,
          ease: "power2.out",
        });
        gsap.from([".voi-hero-content-stack", ".voi-thumbs"], {
          x: -30,
          opacity: 0,
          duration: 3,
          ease: "power2.out",
        });
        gsap.utils
          .toArray<HTMLElement>(".voi-highlights > a")
          .forEach((cell, i) => {
            gsap.fromTo(
              cell,
              {
                autoAlpha: 0,
                x: i === 3 ? 0 : i === 1 ? 40 : -40,
                y: i === 3 ? 40 : 0,
                scale: 1.05,
              },
              {
                autoAlpha: 1,
                x: 0,
                y: 0,
                scale: 1,
                duration: 1.5,
                ease: "power2.inOut",
              },
            );
          });
        gsap.from(".voi-strip-track > a", {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power2.out",
        });
        document
          .querySelectorAll<HTMLElement>(".voi-photo-ribbon")
          .forEach((row, index) => {
            const distance = () => row.scrollWidth / 2;
            gsap.fromTo(
              row,
              { x: index ? -distance() : 0 },
              {
                x: index ? 0 : -distance(),
                duration: index ? 66 : 82,
                repeat: -1,
                ease: "none",
                repeatRefresh: true,
              },
            );
          });
      }, rootRef);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, []);
  return (
    <main id="top" className="home-page" ref={rootRef}>
      {children}
    </main>
  );
}
