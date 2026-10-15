import { notFound } from "next/navigation";
import { hasLocale, locales } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { getArticle, getArticles } from "@/features/blog/articles";
import { ArticlePage } from "@/features/blog/article-page";

type Props = { params: Promise<{ locale: string; slug: string }> };
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getArticles().map((article) => ({ locale, slug: article.slug })),
  );
}
async function resolveArticle(params: Props["params"]) {
  const { locale, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const article = getArticle(slug);
  if (!article) notFound();
  return { locale, article };
}
export async function generateMetadata({ params }: Props) {
  const { locale, article } = await resolveArticle(params);
  const metadata = pageMetadata(
    locale,
    `/blog/${article.slug}`,
    article.title,
    article.excerpt,
  );
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: article.date,
      images: [{ url: article.image, alt: article.imageAlt }],
    },
  };
}
export default async function Page({ params }: Props) {
  const { article } = await resolveArticle(params);
  return <ArticlePage article={article} />;
}
