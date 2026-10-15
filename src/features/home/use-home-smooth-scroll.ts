"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function useHomeSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.08,
      smoothWheel: true,
      allowNestedScroll: true,
      anchors: true,
      respectReducedMotion: true,
    });
    const syncLock = () => {
      const locked =
        document.body.classList.contains("is-menu-open") ||
        document.body.classList.contains("is-intro-active");
      if (locked) lenis.stop();
      else lenis.start();
    };
    const observer = new MutationObserver(syncLock);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    syncLock();
    return () => {
      observer.disconnect();
      lenis.destroy();
    };
  }, []);
}
