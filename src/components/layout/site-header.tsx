"use client";
import Link from "next/link";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/brand/brand-mark";
import { localizePath, type Locale } from "@/i18n/config";
import { company } from "@/lib/company";
import { useHeaderSurface } from "./header/use-header-surface";
import { SoundToggle } from "./site-audio";
import { LanguageSelector } from "./header/language-selector";
import { HeaderSearchButton } from "./header/header-search-button";
import { HeaderCartButton } from "./header/header-cart-button";
import type { Dictionary } from "@/i18n/dictionaries";
import { useSiteNavigation } from "./site-shell";
export function SiteHeader({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: Dictionary["header"];
}) {
  const { isMenuOpen, openMenu } = useSiteNavigation();
  const router = useRouter();
  const header = useRef<HTMLElement>(null);
  const lightSurface = useHeaderSurface(header);
  return (
    <header
      ref={header}
      className="voi-header"
      data-surface={lightSurface ? "light" : "dark"}
    >
      <a className="voi-header-phone" href={company.phoneHref}>
        {company.phone}
      </a>
      <Link className="voi-logo" href="/" aria-label="ВОЙ — главная">
        <BrandMark priority />
      </Link>
      <div className="voi-header-tools">
        <div className="voi-header-desktop-tools">
          <SoundToggle />
          <LanguageSelector
            currentLocale={locale}
            label={dictionary.languageLabel}
            groupLabel={dictionary.languageGroupLabel}
          />
          <HeaderSearchButton
            openLabel={dictionary.searchOpenLabel}
            closeLabel={dictionary.searchCloseLabel}
            placeholder={dictionary.searchPlaceholder}
            submitLabel={dictionary.searchSubmitLabel}
            onSearch={(query) =>
              router.push(
                `${localizePath("/catalog", locale)}?q=${encodeURIComponent(query)}#discover`,
              )
            }
          />
          <HeaderCartButton locale={locale} label={dictionary.cartLabel} />
        </div>
        <button
          className="voi-menu-trigger"
          aria-controls="site-navigation"
          aria-expanded={isMenuOpen}
          data-menu-trigger
          onClick={openMenu}
        >
          Меню
        </button>
      </div>
    </header>
  );
}
