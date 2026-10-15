import clsx from "clsx";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Monitor, X } from "@deemlol/next-icons";
import { BrandMark } from "@/components/brand/brand-mark";
import {
  primaryNavigation,
  secondaryNavigation,
  type AdminNavigationItem,
  type AdminSectionId,
} from "./admin-navigation";

type AdminSidebarProps = {
  activeSection: AdminSectionId;
  collapsed: boolean;
  mobileOpen: boolean;
  onNavigate: (section: AdminSectionId) => void;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
};

type NavigationGroupProps = {
  items: AdminNavigationItem[];
  activeSection: AdminSectionId;
  collapsed: boolean;
  onNavigate: (section: AdminSectionId) => void;
};

function NavigationGroup({
  items,
  activeSection,
  collapsed,
  onNavigate,
}: NavigationGroupProps) {
  return (
    <div className="grid gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        const selected = item.id === activeSection;

        return (
          <button
            key={item.id}
            type="button"
            className={clsx(
              "relative flex min-h-11 w-full cursor-pointer items-center overflow-hidden border-0 bg-transparent p-0 text-left no-underline before:absolute before:inset-x-0 before:inset-y-1.5 before:rounded-lg before:transition-colors",
              selected
                ? "text-white before:bg-neutral-950"
                : "text-admin-muted hover:text-neutral-950 hover:before:bg-admin-bg",
            )}
            aria-current={selected ? "page" : undefined}
            aria-label={collapsed ? item.label : undefined}
            title={collapsed ? item.label : undefined}
            onClick={() => onNavigate(item.id)}
          >
            <span
              className="relative z-10 grid w-11 shrink-0 place-items-center"
              aria-hidden="true"
            >
              <Icon size={16} strokeWidth={1.9} />
            </span>
            <span
              className={clsx(
                "relative z-10 min-w-0 overflow-hidden pr-3 text-xs font-semibold text-ellipsis whitespace-nowrap transition-opacity",
                collapsed && "lg:pointer-events-none lg:w-0 lg:opacity-0",
              )}
            >
              {item.label}
            </span>
            {item.badge ? (
              <span
                className={clsx(
                  "mr-2.5 grid size-5.5 place-items-center rounded-full bg-neutral-200 text-[0.65rem] font-bold text-neutral-700",
                  selected && "bg-white",
                  collapsed && "lg:hidden",
                )}
              >
                {item.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function AdminSidebar({
  activeSection,
  collapsed,
  mobileOpen,
  onNavigate,
  onToggleCollapsed,
  onCloseMobile,
}: AdminSidebarProps) {
  return (
    <>
      <button
        type="button"
        className={clsx(
          "fixed inset-0 z-40 border-0 bg-neutral-950/40 p-0 transition-opacity duration-200 lg:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        aria-label="Закрыть меню"
        tabIndex={mobileOpen ? 0 : -1}
        onClick={onCloseMobile}
      />

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(17rem,86vw)] flex-col overflow-hidden border-r border-admin-border bg-white shadow-[1rem_0_3rem_rgb(20_26_34/0.12)] transition-transform duration-200 lg:sticky lg:top-0 lg:z-20 lg:w-full lg:translate-x-0 lg:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-[102%]",
        )}
      >
        <div
          className={clsx(
            "flex min-h-18 items-center justify-between border-b border-admin-border px-4 py-3",
            collapsed && "lg:justify-center lg:px-0",
          )}
        >
          <Link
            href="/admin"
            className="flex min-w-0 items-center gap-2.5 text-inherit no-underline"
            aria-label="ВОЙ Admin"
          >
            <BrandMark className="size-9 shrink-0 object-contain" priority />
          </Link>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-xl border border-admin-border bg-white text-neutral-600 transition-colors hover:bg-admin-bg hover:text-neutral-950 lg:hidden"
            aria-label="Закрыть меню"
            onClick={onCloseMobile}
          >
            <X size={20} />
          </button>
        </div>

        <nav
          className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2.5 py-3"
          aria-label="Админ-панель"
        >
          <NavigationGroup
            items={primaryNavigation}
            activeSection={activeSection}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />

          <div className="mt-auto mb-3.5 h-px bg-admin-border" />

          <NavigationGroup
            items={secondaryNavigation}
            activeSection={activeSection}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />

          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="relative flex min-h-11 w-full items-center overflow-hidden text-left text-admin-muted no-underline before:absolute before:inset-x-0 before:inset-y-1.5 before:rounded-lg before:transition-colors hover:text-neutral-950 hover:before:bg-admin-bg"
            aria-label={collapsed ? "Открыть сайт" : undefined}
            title={collapsed ? "Открыть сайт" : undefined}
          >
            <span
              className="relative z-10 grid w-11 shrink-0 place-items-center"
              aria-hidden="true"
            >
              <Monitor size={16} strokeWidth={1.9} />
            </span>
            <span
              className={clsx(
                "relative z-10 min-w-0 overflow-hidden pr-3 text-xs font-semibold text-ellipsis whitespace-nowrap transition-opacity",
                collapsed && "lg:pointer-events-none lg:w-0 lg:opacity-0",
              )}
            >
              Открыть сайт
            </span>
          </Link>
        </nav>

        <button
          type="button"
          className="hidden min-h-12 w-full cursor-pointer items-center overflow-hidden border-0 border-t border-admin-border bg-transparent p-0 text-left text-admin-muted transition-colors hover:bg-admin-bg hover:text-neutral-950 lg:flex"
          aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}
          onClick={onToggleCollapsed}
        >
          <span
            className="grid w-11 shrink-0 place-items-center"
            aria-hidden="true"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </span>
          <span
            className={clsx(
              "min-w-0 overflow-hidden pr-3 text-xs font-semibold whitespace-nowrap transition-opacity",
              collapsed && "pointer-events-none w-0 opacity-0",
            )}
          >
            Свернуть
          </span>
        </button>
      </aside>
    </>
  );
}
