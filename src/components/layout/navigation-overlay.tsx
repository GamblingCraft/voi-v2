"use client";

import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { useEffect, useRef } from "react";
import { localizePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import styles from "./navigation-overlay.module.css";
import { LanguageSelector } from "./header/language-selector";
import { HeaderCartButton } from "./header/header-cart-button";
import { HeaderSearchButton } from "./header/header-search-button";
import { SoundToggle } from "./site-audio";

const primaryLinks = [
  { href: "/catalog", key: "catalog" },
  { href: "/product", key: "product" },
  { href: "/production", key: "production" },
  { href: "/cooperation", key: "cooperation" },
  { href: "/blog", key: "blog" },
  { href: "/contacts", key: "contacts" },
] as const;

type NavigationOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  isNavigating: boolean;
  keepBackdrop: boolean;
  locale: Locale;
  dictionary: Dictionary["navigation"];
  headerDictionary: Dictionary["header"];
};

export function NavigationOverlay({
  isOpen,
  onClose,
  onNavigate,
  isNavigating,
  keepBackdrop,
  locale,
  dictionary,
  headerDictionary,
}: NavigationOverlayProps) {
  const navigationRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !navigationRef.current) return;

      const focusable = Array.from(
        navigationRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(
        (element) =>
          element.getClientRects().length > 0 && !element.closest("[inert]"),
      );

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`${styles.backdrop} ${keepBackdrop ? styles.backdropOpen : ""}`}
        aria-hidden="true"
      />
      <nav
        ref={navigationRef}
        id="site-navigation"
        className={`${styles.navigation} ${isOpen ? styles.navigationOpen : ""}`}
        aria-label={dictionary.label}
        aria-hidden={!isOpen}
        inert={!isOpen || isNavigating ? true : undefined}
        aria-busy={isNavigating}
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <button
          ref={closeButtonRef}
          className={styles.closeButton}
          type="button"
          onClick={onClose}
        >
          <span>{dictionary.close}</span>
          <span aria-hidden="true">×</span>
        </button>

        <div className={styles.links} data-ui-navigation>
          {primaryLinks.map((link, index) => (
            <Link
              key={link.href}
              className={styles.link}
              href={localizePath(link.href, locale)}
              onNavigate={(event) => {
                event.preventDefault();
                onNavigate(localizePath(link.href, locale));
              }}
              style={{ "--link-index": index } as React.CSSProperties}
            >
              <span>{dictionary.links[link.key]}</span>
            </Link>
          ))}
        </div>
        <div className={styles.mobileTools}>
          <div className={styles.utilityRow}>
            <SoundToggle />
            <LanguageSelector
              theme="dark"
              currentLocale={locale}
              label={headerDictionary.languageLabel}
              groupLabel={headerDictionary.languageGroupLabel}
            />
            <HeaderSearchButton
              openLabel={headerDictionary.searchOpenLabel}
              closeLabel={headerDictionary.searchCloseLabel}
              placeholder={headerDictionary.searchPlaceholder}
              submitLabel={headerDictionary.searchSubmitLabel}
              onSearch={(query) =>
                onNavigate(
                  `${localizePath("/catalog", locale)}?q=${encodeURIComponent(query)}#discover`,
                )
              }
            />
            <HeaderCartButton
              locale={locale}
              label={headerDictionary.cartLabel}
            />
          </div>
        </div>
        <Link
          className={styles.mobileBrand}
          href={localizePath("/", locale)}
          aria-label={headerDictionary.homeLabel}
          onNavigate={(event) => {
            event.preventDefault();
            onNavigate(localizePath("/", locale));
          }}
        >
          <BrandMark />
        </Link>
      </nav>
    </>
  );
}
