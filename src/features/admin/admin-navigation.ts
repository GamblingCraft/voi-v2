import {
  BarChart,
  FileText,
  Globe,
  Image,
  Layout,
  MessageSquare,
  Package,
  PenTool,
  Settings,
  ShoppingCart,
} from "@deemlol/next-icons";
import type { ElementType } from "react";

export type AdminSectionId =
  | "overview"
  | "catalog"
  | "orders"
  | "content"
  | "media"
  | "blog"
  | "requests"
  | "analytics"
  | "settings"
  | "seo";

export type AdminNavigationItem = {
  id: AdminSectionId;
  label: string;
  icon: ElementType;
  badge?: number;
};

export const primaryNavigation: AdminNavigationItem[] = [
  { id: "overview", label: "Обзор", icon: Layout },
  { id: "catalog", label: "Каталог", icon: Package },
  { id: "orders", label: "Заказы", icon: ShoppingCart },
  { id: "content", label: "Контент", icon: FileText },
  { id: "media", label: "Медиа", icon: Image },
  { id: "blog", label: "Блог", icon: PenTool },
  { id: "requests", label: "Обращения", icon: MessageSquare },
  { id: "analytics", label: "Аналитика", icon: BarChart },
];

export const secondaryNavigation: AdminNavigationItem[] = [
  { id: "settings", label: "Настройки", icon: Settings },
  { id: "seo", label: "SEO", icon: Globe },
];

export const sectionTitles: Record<AdminSectionId, string> = {
  overview: "Обзор",
  catalog: "Каталог",
  orders: "Заказы",
  content: "Контент сайта",
  media: "Медиатека",
  blog: "Блог",
  requests: "Обращения",
  analytics: "Аналитика",
  settings: "Настройки",
  seo: "SEO",
};
