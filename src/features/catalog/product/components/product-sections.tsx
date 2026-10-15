"use client";

import { useRef, useState, type ReactNode } from "react";
import tabsStyles from "./product-tabs.module.css";

export function ProductSections({
  panels,
}: {
  panels: { label: string; content: ReactNode }[];
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className={tabsStyles.sections}>
      <div className={tabsStyles.tabs} role="tablist" aria-label="О товаре">
        {panels.map(({ label }, index) => (
          <button
            key={label}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`product-tab-${index}`}
            aria-controls={`product-panel-${index}`}
            aria-selected={active === index}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              const next =
                event.key === "ArrowRight"
                  ? (index + 1) % panels.length
                  : event.key === "ArrowLeft"
                    ? (index + panels.length - 1) % panels.length
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? panels.length - 1
                        : null;
              if (next !== null) {
                event.preventDefault();
                setActive(next);
                refs.current[next]?.focus();
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {panels.map(({ label, content }, index) => (
        <div
          key={label}
          role="tabpanel"
          id={`product-panel-${index}`}
          aria-labelledby={`product-tab-${index}`}
          hidden={active !== index}
          tabIndex={0}
          className={tabsStyles.panel}
        >
          {content}
        </div>
      ))}
    </div>
  );
}
