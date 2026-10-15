"use client";

import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { NavigationOverlay } from "./navigation-overlay";
import { useMenuSnapshot } from "./navigation/use-menu-snapshot";
import styles from "./site-shell.module.css";
import { SiteAudioProvider } from "./site-audio";
import { isCatalogPath } from "@/lib/navigation-paths";

type NavigationContextValue = {
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function useSiteNavigation() {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error("useSiteNavigation must be used inside SiteShell");
  }

  return context;
}

type SiteShellProps = {
  children: React.ReactNode;
  locale: Locale;
  navigationDictionary: Dictionary["navigation"];
  headerDictionary: Dictionary["header"];
};

export function SiteShell(props: SiteShellProps) {
  return (
    <SiteAudioProvider>
      <SiteShellContent {...props} />
    </SiteAudioProvider>
  );
}

function SiteShellContent({
  children,
  locale,
  navigationDictionary,
  headerDictionary,
}: SiteShellProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const snapshotRef = useRef<HTMLDivElement>(null);
  const {
    isMenuOpen,
    isClosing,
    isNavigating,
    hasSnapshot,
    openMenu,
    closeMenu,
    navigateFromMenu,
  } = useMenuSnapshot(surfaceRef, snapshotRef);

  useEffect(() => {
    document.body.classList.toggle("is-menu-open", isMenuOpen);

    if (!isMenuOpen) return;

    const root = document.documentElement;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = root.style.overflow;

    document.body.style.overflow = "hidden";
    root.style.overflow = "hidden";

    return () => {
      document.body.classList.remove("is-menu-open");
      document.body.style.overflow = previousBodyOverflow;
      root.style.overflow = previousRootOverflow;
    };
  }, [isMenuOpen]);

  const navigation = useMemo(
    () => ({ isMenuOpen, openMenu, closeMenu }),
    [closeMenu, isMenuOpen, openMenu],
  );

  return (
    <NavigationContext.Provider value={navigation}>
      <NavigationOverlay
        isOpen={isMenuOpen && !isClosing}
        onClose={closeMenu}
        onNavigate={navigateFromMenu}
        isNavigating={isNavigating}
        keepBackdrop={isMenuOpen}
        locale={locale}
        dictionary={navigationDictionary}
        headerDictionary={headerDictionary}
      />
      <div
        ref={snapshotRef}
        className={styles.snapshotViewport}
        data-menu-snapshot={hasSnapshot || undefined}
        aria-hidden="true"
        inert
      />
      <div
        onClickCapture={(event) => {
          if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return;
          const anchor = (event.target as Element).closest<HTMLAnchorElement>(
            "a[href]",
          );
          if (!anchor || anchor.target || anchor.hasAttribute("download"))
            return;
          const url = new URL(anchor.href, location.href);
          if (isCatalogPath(location.pathname) && isCatalogPath(url.pathname))
            return;
          if (
            url.origin !== location.origin ||
            url.pathname === location.pathname ||
            url.hash
          )
            return;
          event.preventDefault();
          openMenu();
          window.setTimeout(
            () => navigateFromMenu(url.pathname + url.search),
            matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650,
          );
        }}
        ref={surfaceRef}
        className={styles.pageSurface}
        data-menu-hidden={isMenuOpen || undefined}
        data-menu-revealing={(isNavigating && isClosing) || undefined}
        data-menu-capture={hasSnapshot || undefined}
        inert={isMenuOpen ? true : undefined}
        aria-hidden={isMenuOpen || undefined}
      >
        {children}
      </div>
    </NavigationContext.Provider>
  );
}
