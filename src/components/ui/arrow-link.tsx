import Link from "next/link";
import type { ReactNode } from "react";
export function ArrowLink({
  href,
  children,
  id,
}: {
  id?: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link data-ui-action className="voi-button" href={href} id={id}>
      <span>{children}</span>
      <i aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="none">
          <path
            d="M3 10h13M11 5l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <svg className="voi-arrow-ghost" viewBox="0 0 20 20" fill="none">
          <path
            d="M3 10h13M11 5l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </i>
    </Link>
  );
}
