import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import "./admin.css";

const adminFont = Inter({
  subsets: ["cyrillic", "latin"],
  variable: "--font-admin",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Админ-панель | ВОЙ",
  description: "Управление контентом и каталогом ВОЙ.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <html lang="ru">
      <body
        className={`${adminFont.variable} min-w-80 bg-admin-bg font-sans text-admin-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
