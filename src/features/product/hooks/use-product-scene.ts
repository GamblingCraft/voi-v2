"use client";

import { useEffect, useState, useRef, type RefObject } from "react";
import { useSiteNavigation } from "@/components/layout/site-shell";
import { createDisposalScope } from "@/lib/disposal-scope";
import { MOBILE_SCENE_QUERY } from "@/lib/motion/scene-layout";
import {
  createSceneLoadingTracker,
  reportSceneLoading,
} from "@/lib/three/scene-loading";
import type { setupProductMotion } from "@/lib/motion/product-motion";

type Motion = ReturnType<typeof setupProductMotion>;

export function useProductScene(root: RefObject<HTMLDivElement | null>) {
  const [entered, setEntered] = useState(true);
  const [layout, setLayout] = useState({ mobile: false, width: 0 });
  const restoreScroll = useRef<number | undefined>(undefined);
  const motion = useRef<Motion | null>(null);
  const menuOpen = useRef(false);
  const { isMenuOpen } = useSiteNavigation();

  useEffect(() => {
    menuOpen.current = isMenuOpen;
    motion.current?.pause(isMenuOpen);
  }, [isMenuOpen]);

  useEffect(() => {
    const query = matchMedia(MOBILE_SCENE_QUERY);
    let resizeTimer: ReturnType<typeof setTimeout>;
    const update = () => {
      restoreScroll.current = window.scrollY;
      setLayout((previous) =>
        previous.mobile === query.matches && previous.width === innerWidth
          ? previous
          : { mobile: query.matches, width: innerWidth },
      );
    };
    const resized = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(update, 200);
    };
    update();
    query.addEventListener("change", update);
    window.addEventListener("resize", resized);
    return () => {
      clearTimeout(resizeTimer);
      query.removeEventListener("change", update);
      window.removeEventListener("resize", resized);
    };
  }, []);

  useEffect(() => {
    const page = root.current;
    if (!layout.width || !page) return;
    const scope = createDisposalScope();
    let cancelled = false;
    let lastProgress = 0;
    let frame = 0;
    page.setAttribute("data-scene-ready", "false");
    const progress = createSceneLoadingTracker((state) => {
      if (cancelled) return;
      lastProgress = state.progress;
      reportSceneLoading(state);
    });
    const start = async () => {
      const [animation, three, backgrounds] = await Promise.all([
        import("@/lib/motion/product-motion"),
        import("@/lib/three/product-scene"),
        import("@/lib/motion/scene-backgrounds"),
      ]);
      if (cancelled) return;
      progress("runtime", 1, "Подготовка оформления");
      await document.fonts.ready;
      if (cancelled) return;
      progress("fonts", 1, "Подготовка сцены");
      const controls = animation.setupProductMotion(
        page,
        restoreScroll.current,
      );
      motion.current = controls;
      scope.add(() => {
        controls.dispose();
        motion.current = null;
      });
      restoreScroll.current = undefined;
      scope.add(backgrounds.setupSceneBackgrounds(page));
      const scene = three.createProductScene(progress, true);
      scope.add(scene.dispose);
      await scene.ready;
      if (cancelled) return;
      controls.enter();
      controls.pause(menuOpen.current);
      setEntered(true);
      frame = requestAnimationFrame(() => {
        if (cancelled) return;
        controls.refresh();
        window.dispatchEvent(new Event("voi:capture-frame"));
        page.setAttribute("data-scene-ready", "true");
      });
    };
    void start().catch((error: unknown) => {
      scope.dispose();
      if (cancelled) return;
      console.error("scene-initialization", error);
      reportSceneLoading({
        progress: lastProgress,
        status: "Не удалось загрузить сцену",
        failed: true,
      });
      // Keep server-rendered content and shared catalog available on WebGL failure.
      page.setAttribute("data-scene-ready", "failed");
      page
        .querySelectorAll<HTMLElement>("[id$='showcase'], [id$='product-card']")
        .forEach((element) => {
          element.removeAttribute("aria-hidden");
          element.removeAttribute("inert");
        });
      setEntered(true);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      scope.dispose();
      document.body.classList.remove(
        "voi-hero-active",
        "voi-cloud-active",
        "voi-cloud-rear-hidden",
        "voi-after-clouds",
      );
    };
  }, [layout, root]);
  return entered;
}
