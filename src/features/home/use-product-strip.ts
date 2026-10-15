"use client";
import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
export function useProductStrip(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current?.matches(".voi-product-strip")
      ? root.current
      : root.current?.querySelector<HTMLElement>(".voi-product-strip");
    const track = el?.querySelector<HTMLElement>(".voi-strip-track");
    if (!el || !track) return;
    gsap.registerPlugin(Draggable, InertiaPlugin);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const period = () => {
        const starts = track.querySelectorAll<HTMLElement>("[data-loop-start]");
        return starts.length > 1
          ? starts[1].offsetLeft - starts[0].offsetLeft
          : 0;
      };
      let tween: gsap.core.Tween | undefined,
        direction = 1,
        width = period();
      let wrap = gsap.utils.wrap(-width, 0);
      const start = () => {
        tween?.kill();
        const x = Number(gsap.getProperty(track, "x")) || 0;
        if (width <= 0) return;
        tween = gsap.to(track, {
          x: x - width * direction,
          duration: (width * 25) / (innerWidth * 1.25),
          ease: "none",
          repeat: -1,
          modifiers: { x: (v) => wrap(parseFloat(v)) + "px" },
        });
        if (el.matches(":hover")) tween.timeScale(0);
      };
      const drag = Draggable.create(track, {
        type: "x",
        inertia: true,
        allowContextMenu: true,
        edgeResistance: 0.95,
        dragResistance: 0.4,
        throwResistance: 8000,
        liveSnap: { x: (x) => wrap(x) },
        onDragStart() {
          tween?.kill();
        },
        onDrag() {
          if (this.deltaX > 2) direction = -1;
          else if (this.deltaX < -2) direction = 1;
        },
        onThrowUpdate() {
          if (this.deltaX > 2) direction = -1;
          else if (this.deltaX < -2) direction = 1;
        },
        onRelease() {
          if (!this.isThrowing) start();
        },
        onThrowComplete: start,
      })[0];
      const hover = () => {
        if (tween)
          gsap.to(tween, {
            timeScale: 0,
            duration: 1.2,
            ease: "power2.out",
            overwrite: true,
          });
      };
      const leave = () => {
        if (tween && !drag.isDragging && !drag.isThrowing)
          gsap.to(tween, {
            timeScale: 1,
            duration: 1.2,
            ease: "power2.out",
            overwrite: true,
          });
      };
      const resize = () => {
        width = period();
        wrap = gsap.utils.wrap(-width, 0);
        start();
      };
      const sizeObserver = new ResizeObserver(resize);
      sizeObserver.observe(track);
      sizeObserver.observe(el);
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) tween?.resume();
          else tween?.pause();
        },
        { rootMargin: "300px" },
      );
      observer.observe(el);
      el.addEventListener("mouseenter", hover);
      el.addEventListener("mouseleave", leave);
      el.addEventListener("focusin", hover);
      el.addEventListener("focusout", leave);
      window.addEventListener("resize", resize);
      start();
      return () => {
        tween?.kill();
        drag.kill();
        observer.disconnect();
        sizeObserver.disconnect();
        el.removeEventListener("mouseenter", hover);
        el.removeEventListener("mouseleave", leave);
        el.removeEventListener("focusin", hover);
        el.removeEventListener("focusout", leave);
        window.removeEventListener("resize", resize);
        gsap.set(track, { clearProps: "transform" });
      };
    });
    return () => media.revert();
  }, [root]);
}
