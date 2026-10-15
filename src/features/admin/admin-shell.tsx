"use client";

import clsx from "clsx";
import { useState } from "react";
import { Bell, Menu } from "@deemlol/next-icons";
import { AdminDashboard } from "./admin-dashboard";
import { AdminEmptySection } from "./admin-empty-section";
import { sectionTitles, type AdminSectionId } from "./admin-navigation";
import { AdminSidebar } from "./admin-sidebar";

export function AdminShell() {
  const [activeSection, setActiveSection] =
    useState<AdminSectionId>("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = (section: AdminSectionId) => {
    setActiveSection(section);
    setMobileOpen(false);
  };

  return (
    <div
      className={clsx(
        "min-h-dvh bg-admin-bg text-admin-ink lg:grid lg:transition-[grid-template-columns] lg:duration-200",
        collapsed
          ? "lg:grid-cols-[4rem_minmax(0,1fr)]"
          : "lg:grid-cols-[15rem_minmax(0,1fr)]",
      )}
    >
      <AdminSidebar
        activeSection={activeSection}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onNavigate={navigate}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main className="min-w-0">
        <header className="sticky top-0 z-30 flex min-h-18 items-center justify-between gap-6 border-b border-admin-border bg-white/92 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3.5">
            <button
              type="button"
              className="grid size-11 shrink-0 place-items-center rounded-xl border border-admin-border bg-white text-neutral-600 transition-colors hover:bg-admin-bg hover:text-neutral-950 lg:hidden"
              aria-label="Открыть меню"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={21} />
            </button>
            <div>
              <p className="mb-1 hidden text-[0.64rem] font-bold tracking-[0.12em] text-neutral-400 sm:block">
                ВОЙ / АДМИН-ПАНЕЛЬ
              </p>
              <h1 className="m-0 text-[clamp(1.25rem,2vw,1.65rem)] font-semibold tracking-[-0.035em]">
                {sectionTitles[activeSection]}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="hidden size-11 place-items-center rounded-xl border border-admin-border bg-white text-neutral-600 transition-colors hover:bg-admin-bg hover:text-neutral-950 sm:grid"
              aria-label="Уведомления"
            >
              <Bell size={20} strokeWidth={1.8} />
            </button>
            <div className="hidden min-h-10 items-center rounded-lg border border-admin-border bg-white px-3 text-xs font-semibold text-neutral-700 sm:flex">
              Администратор
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {activeSection === "overview" ? (
            <AdminDashboard />
          ) : (
            <AdminEmptySection section={activeSection} />
          )}
        </div>
      </main>
    </div>
  );
}
