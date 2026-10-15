"use client";

import { useEffect, useRef } from "react";

export function ViewportVideo({
  src,
  className,
  label,
}: {
  src: string;
  className: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let visible = false;
    let loaded = false;
    const sync = () => {
      if (
        loaded &&
        visible &&
        !document.hidden &&
        !document.body.classList.contains("is-menu-open")
      ) {
        void video.play().catch(() => undefined);
      } else video.pause();
    };
    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || loaded) return;
        loaded = true;
        video.src = src;
        video.load();
        preloadObserver.disconnect();
        sync();
      },
      { rootMargin: "200px" },
    );
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    const menuObserver = new MutationObserver(sync);
    menuObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    preloadObserver.observe(video);
    visibilityObserver.observe(video);
    document.addEventListener("visibilitychange", sync);
    return () => {
      preloadObserver.disconnect();
      visibilityObserver.disconnect();
      menuObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src]);
  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    />
  );
}
