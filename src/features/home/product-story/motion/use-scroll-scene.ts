"use client";

import { useEffect, type RefObject } from "react";
import { useSiteNavigation } from "@/components/layout/site-shell";
import type { StorySceneKind } from "../story.types";
import { clamp, getSceneVariables } from "./scene-motion";

type Options = {
  sceneRef: RefObject<HTMLElement | null>;
  screenRef: RefObject<HTMLDivElement | null>;
  kind: StorySceneKind;
  itemCount?: number;
  onProgress?: (progress: number) => void;
};

// Layout coordinates exclude the page tilt used by the menu transition.
function getDocumentTop(element: HTMLElement) {
  let top = 0;
  let current: HTMLElement | null = element;
  while (current) {
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return top;
}

export function useScrollScene({
  sceneRef,
  screenRef,
  kind,
  itemCount = 1,
  onProgress,
}: Options) {
  const { isMenuOpen } = useSiteNavigation();

  useEffect(() => {
    const scene = sceneRef.current;
    const screen = screenRef.current;
    if (!scene || !screen) return;
    const track = screen.querySelector<HTMLElement>("[data-story-track]");

    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = true;
    const render = () => {
      frame = 0;
      if (isMenuOpen) return;
      scene.dataset.motion = reducedMotion.matches ? "static" : "scroll";
      if (reducedMotion.matches) {
        const variables = getSceneVariables(kind, 1, {
          width: 0,
          height: 0,
          travel: 0,
          itemCount,
        });
        Object.keys(variables).forEach((key) =>
          scene.style.removeProperty(key),
        );
        onProgress?.(0);
        return;
      }

      const distance = Math.max(0, scene.offsetHeight - screen.clientHeight);
      const offset = Math.min(
        distance,
        Math.max(0, window.scrollY - getDocumentTop(scene)),
      );
      const progress = clamp(offset / Math.max(1, distance));
      scene.style.setProperty("--scene-offset", `${offset}px`);
      const variables = getSceneVariables(kind, progress, {
        width: screen.clientWidth,
        height: screen.clientHeight,
        travel: Math.max(
          0,
          (track?.scrollWidth ?? screen.clientWidth) - screen.clientWidth,
        ),
        itemCount,
      });
      Object.entries(variables).forEach(([key, value]) =>
        scene.style.setProperty(key, value),
      );
      onProgress?.(progress);
    };
    const schedule = () => {
      if (visible && !frame) frame = requestAnimationFrame(render);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) schedule();
      },
      { rootMargin: "100px" },
    );
    observer.observe(scene);
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(screen);
    if (track) resizeObserver.observe(track);
    const motionChange = () => {
      // Also reset offscreen scenes so a half-complete animation never becomes
      // the static layout when the accessibility preference changes.
      cancelAnimationFrame(frame);
      render();
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", motionChange);
    render();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", motionChange);
    };
  }, [sceneRef, screenRef, kind, itemCount, isMenuOpen, onProgress]);

  return isMenuOpen;
}
