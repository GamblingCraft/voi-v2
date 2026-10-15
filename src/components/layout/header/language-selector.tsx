"use client";

import { ChevronDown } from "@deemlol/next-icons";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import {
  localizePath,
  localeConfig,
  locales,
  type Locale,
} from "@/i18n/config";
import styles from "./language-selector.module.css";
import { GlobeIcon } from "./globe-icon";

type LanguageSelectorProps = {
  currentLocale: Locale;
  label: string;
  groupLabel: string;
  theme?: "light" | "dark";
};

export function LanguageSelector({
  currentLocale,
  label,
  groupLabel,
  theme = "light",
}: LanguageSelectorProps) {
  const pathname = usePathname();
  const optionsId = useId();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selectLocale = (nextLocale: Locale) => {
    const segments = pathname.split("/");
    const firstSegment = segments[1];
    const pathWithoutLocale = locales.includes(firstSegment as Locale)
      ? `/${segments.slice(2).join("/")}`
      : pathname;
    const normalizedPath =
      pathWithoutLocale === "/" ? "/" : pathWithoutLocale.replace(/\/$/, "");
    const localizedPath = localizePath(normalizedPath, nextLocale);

    setIsOpen(false);
    router.replace(`${localizedPath}${window.location.search}`);
  };

  return (
    <div ref={rootRef} className={styles.languageSelector} data-theme={theme}>
      <button
        ref={triggerRef}
        className={styles.trigger}
        type="button"
        aria-label={label}
        aria-controls={optionsId}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <GlobeIcon className={styles.globe} />
        <span>{localeConfig[currentLocale].shortLabel}</span>
        <ChevronDown
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          size={15}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </button>

      <div
        id={optionsId}
        className={`${styles.options} ${isOpen ? styles.optionsOpen : ""}`}
        role="group"
        aria-label={groupLabel}
        aria-hidden={!isOpen}
        inert={isOpen ? undefined : true}
      >
        {(Object.keys(localeConfig) as Locale[]).map((locale) => (
          <button
            key={locale}
            className={styles.option}
            type="button"
            lang={localeConfig[locale].htmlLang}
            disabled={!locales.includes(locale)}
            title={
              !locales.includes(locale) ? "Перевод пока не готов" : undefined
            }
            aria-pressed={currentLocale === locale}
            onClick={() => selectLocale(locale)}
          >
            <span>{localeConfig[locale].label}</span>
            <span className={styles.optionCode}>
              {locales.includes(locale)
                ? currentLocale === locale
                  ? "✓"
                  : ""
                : "Скоро"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
