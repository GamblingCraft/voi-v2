"use client";
import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useSiteNavigation } from "../site-shell";
export function useFooterMotion(root: RefObject<HTMLElement | null>) {
  const pathname = usePathname();
  const { isMenuOpen } = useSiteNavigation();
  useEffect(() => {
    if (isMenuOpen) return;
    // The incoming page is translated during navigation; measure after it settles.
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [isMenuOpen]);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 1023px)",
      },
      ({ conditions }) => {
        if (!conditions?.motion) return;
        const context = gsap.context(() => {
          const panel = root.current?.querySelector(".voi-footer-panel");
          if (!panel) return;
          const footer = root.current!;
          const prelude = footer.querySelector<HTMLElement>(
            ".voi-footer-prelude",
          );
          if (footer.closest(".product-root") && prelude) {
            // Native sticky cannot follow the transformed ScrollSmoother content.
            // Keep the video in place using its live viewport position instead.
            const legal = footer.querySelector(".voi-footer-legal");
            gsap.set(prelude, { position: "relative", y: 0 });
            gsap.set(panel, { y: 0, scale: 1 });
            gsap.set(legal, { y: 0 });
            const movePrelude = gsap.quickSetter(prelude, "y", "px");
            const update = () => {
              if (document.body.classList.contains("is-menu-open")) return;
              const rect = footer.getBoundingClientRect();
              const height = prelude.offsetHeight;
              const hold = Math.max(0, rect.height - height);
              movePrelude(Math.max(0, Math.min(hold, -rect.top)));
            };
            gsap.ticker.add(update);
            update();
            return () => gsap.ticker.remove(update);
          }
          gsap.fromTo(
            panel,
            { y: 200, scale: 1.1 },
            {
              y: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: conditions.mobile ? panel : root.current,
                start: "top bottom",
                end: conditions.mobile ? "top center" : "bottom bottom",
                scrub: true,
              },
            },
          );
          gsap.fromTo(
            ".voi-footer-legal",
            { y: -200 },
            {
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top bottom",
                end: "bottom bottom",
                scrub: true,
              },
            },
          );
          gsap.fromTo(
            ".voi-footer-caption",
            { scale: 1 },
            {
              scale: 0.94,
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
              },
            },
          );
        }, root);
        return () => context.revert();
      },
    );
    // Route content and local fonts can settle after this persistent layout mounts.
    let frame = 0;
    let disposed = false;
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    const observer = new ResizeObserver(refresh);
    observer.observe(document.body);
    document.fonts.ready.then(() => {
      if (!disposed) refresh();
    });
    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      media.revert();
    };
  }, [pathname, root]);
}
