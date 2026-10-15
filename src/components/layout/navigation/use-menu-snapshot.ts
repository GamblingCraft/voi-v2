"use client";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { flushSync } from "react-dom";
import { captureMenuViewport } from "./capture-menu-viewport";
import { isCatalogPath } from "@/lib/navigation-paths";

export function useMenuSnapshot(
  surfaceRef: RefObject<HTMLDivElement | null>,
  snapshotRef: RefObject<HTMLDivElement | null>,
) {
  const pathname = usePathname();
  const router = useRouter();
  const pendingPath = useRef<string | null>(null);
  const entranceRef = useRef<Animation | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hasSnapshot, setHasSnapshot] = useState(false);
  const animationRef = useRef<Animation | null>(null);
  const phaseRef = useRef<"closed" | "open" | "closing" | "navigating">(
    "closed",
  );
  const finishClose = useCallback(
    (restoreTrigger = true) => {
      pendingPath.current = null;
      entranceRef.current?.cancel();
      entranceRef.current = null;
      surfaceRef.current?.style.removeProperty("visibility");
      const animation = animationRef.current;
      animationRef.current = null;
      animation?.cancel();
      snapshotRef.current?.replaceChildren();
      phaseRef.current = "closed";
      flushSync(() => {
        setIsNavigating(false);
        setIsMenuOpen(false);
        setIsClosing(false);
        setHasSnapshot(false);
      });
      if (restoreTrigger)
        requestAnimationFrame(() =>
          document
            .querySelector<HTMLElement>("[data-menu-trigger]")
            ?.focus({ preventScroll: true }),
        );
    },
    [snapshotRef, surfaceRef],
  );
  const openMenu = useCallback(() => {
    if (phaseRef.current !== "closed") return;
    phaseRef.current = "open";
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const surface = surfaceRef.current;
    const snapshot = snapshotRef.current;
    let captured = false;
    let freezeSticky: (() => void) | undefined;
    if (!reduced && surface && snapshot) {
      try {
        const frame = captureMenuViewport(surface);
        if (frame) {
          snapshot.style.width = `${frame.width}px`;
          snapshot.style.height = `${frame.height}px`;
          snapshot.replaceChildren(frame.node);
          freezeSticky = frame.freezeSticky;
          captured = true;
        }
      } catch {
        snapshot.replaceChildren();
      }
    }
    flushSync(() => {
      setHasSnapshot(captured);
      setIsMenuOpen(true);
    });
    if (captured && snapshot) {
      freezeSticky?.();
      const shift =
        innerWidth < 768
          ? "translate3d(-91%, -10svh, 0) rotate(10deg) scale(.84)"
          : "translate3d(-48%, -12svh, 0) rotate(9deg) scale(.86)";
      animationRef.current = snapshot.animate(
        [{ transform: "translate3d(0, 0, 0)" }, { transform: shift }],
        { duration: 900, easing: "cubic-bezier(.76, 0, .24, 1)", fill: "both" },
      );
    }
  }, [surfaceRef, snapshotRef]);
  const closeMenu = useCallback(() => {
    if (phaseRef.current !== "open") return;
    phaseRef.current = "closing";
    setIsClosing(true);
    const animation = animationRef.current;
    if (!animation || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClose();
      return;
    }
    animation.reverse();
    const complete = () => {
      if (animationRef.current === animation) finishClose();
    };
    void animation.finished.then(complete, complete);
  }, [finishClose]);
  const navigateFromMenu = useCallback(
    (href: string) => {
      if (phaseRef.current !== "open") return;
      const destination = new URL(href, location.href);
      if (isCatalogPath(pathname) && isCatalogPath(destination.pathname)) {
        router.push(href);
        finishClose(false);
        return;
      }
      if (destination.pathname === pathname) {
        if (
          destination.search !== location.search ||
          destination.hash !== location.hash
        ) {
          router.push(href);
        }
        closeMenu();
        return;
      }
      phaseRef.current = "navigating";
      pendingPath.current = destination.pathname;
      setIsNavigating(true);
      router.push(href, { scroll: false });
    },
    [closeMenu, finishClose, pathname, router],
  );

  const revealDestination = useCallback(() => {
    const surface = surfaceRef.current;
    const snapshot = snapshotRef.current;
    if (!surface || !snapshot) return;
    pendingPath.current = null;
    setIsClosing(true);
    window.scrollTo({ top: 0, behavior: "instant" });
    const complete = () => {
      finishClose(false);
      const heading = surface.querySelector<HTMLElement>("main h1");
      if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
        heading.addEventListener(
          "blur",
          () => heading.removeAttribute("tabindex"),
          { once: true },
        );
      }
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Finish outside the layout effect so React can commit the new route first.
      queueMicrotask(complete);
      return;
    }
    const oldTransform = getComputedStyle(snapshot).transform;
    animationRef.current?.cancel();
    animationRef.current = snapshot.animate(
      [
        { transform: oldTransform },
        {
          transform: `translate3d(0, 140vh, 0) ${oldTransform === "none" ? "" : oldTransform}`,
        },
      ],
      { duration: 640, easing: "cubic-bezier(.55, 0, .8, .4)", fill: "both" },
    );
    surface.style.visibility = "visible";
    const entrance = surface.animate(
      [
        {
          transform: "translate3d(0, 105vh, 0)",
          borderRadius: "28px 28px 0 0",
        },
        { transform: "translate3d(0, 0, 0)", borderRadius: "0px" },
      ],
      {
        duration: 850,
        delay: 180,
        easing: "cubic-bezier(.22, 1, .36, 1)",
        fill: "both",
      },
    );
    entranceRef.current = entrance;
    void entrance.finished.then(
      () => {
        if (entranceRef.current === entrance) complete();
      },
      () => {},
    );
  }, [finishClose, snapshotRef, surfaceRef]);

  useLayoutEffect(() => {
    if (pendingPath.current === pathname) revealDestination();
  }, [pathname, revealDestination]);

  useEffect(
    () => () => {
      const animation = animationRef.current;
      animationRef.current = null;
      animation?.cancel();
      entranceRef.current?.cancel();
      snapshotRef.current?.replaceChildren();
    },
    [snapshotRef],
  );
  return {
    isMenuOpen,
    isClosing,
    isNavigating,
    hasSnapshot,
    openMenu,
    closeMenu,
    navigateFromMenu,
  };
}
