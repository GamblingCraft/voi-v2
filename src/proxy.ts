import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const defaultPrefix = `/${defaultLocale}`;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return NextResponse.next();
  }

  if (pathname === defaultPrefix || pathname.startsWith(`${defaultPrefix}/`)) {
    return NextResponse.next();
  }

  const pathnameHasPublicLocale = locales
    .filter((locale) => locale !== defaultLocale)
    .some(
      (locale) =>
        pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
    );

  if (pathnameHasPublicLocale) return NextResponse.next();

  const localizedUrl = request.nextUrl.clone();
  localizedUrl.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;

  return NextResponse.rewrite(localizedUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
