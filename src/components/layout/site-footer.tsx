"use client";
import { useRef } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { FooterBackdrop } from "./footer/footer-backdrop";
import { FooterPanel } from "./footer/footer-panel";
import { useFooterMotion } from "./footer/use-footer-motion";
export function SiteFooter({
  locale,
}: {
  locale: Locale;
  dictionary: Dictionary["footer"];
}) {
  const root = useRef<HTMLElement>(null);
  useFooterMotion(root);
  return (
    <footer className="voi-footer-scene" ref={root} lang={locale}>
      <FooterBackdrop />
      <FooterPanel />
    </footer>
  );
}
