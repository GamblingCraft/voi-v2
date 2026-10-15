"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
// The restored product scene owns its footer inside ScrollSmoother.
export function SiteFooterPlacement({ children }: { children: ReactNode }) {
  return /\/product\/?$/.test(usePathname()) ? null : children;
}
