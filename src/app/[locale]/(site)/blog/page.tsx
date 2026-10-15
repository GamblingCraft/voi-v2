import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { BlogPage } from "@/features/blog/blog-page";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string | string[]; topic?: string | string[] }>;
};
export async function generateMetadata({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const query = await searchParams;
  return {
    ...pageMetadata(
      locale,
      "/blog",
      "Журнал ВОЙ — о льде, подаче и работе за баром",
      "Как выбрать лёд для напитков, подготовить заказ на мероприятие и организовать поставки. Практические материалы ВОЙ.",
    ),
    ...(query.q || query.topic
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}
export default async function Page({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const query = await searchParams;
  return (
    <BlogPage
      query={typeof query.q === "string" ? query.q.trim().slice(0, 200) : ""}
      topic={typeof query.topic === "string" ? query.topic : ""}
    />
  );
}
