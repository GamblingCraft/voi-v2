import "server-only";
import { selectProductArticles } from "./article-relations";
import { blogArticles } from "./blog.content";

export function getArticles() {
  return blogArticles.filter((article) => article.status === "published");
}
export function getArticle(slug: string) {
  return getArticles().find((article) => article.slug === slug);
}
export function getProductArticles(product: {
  id: string;
  tags: readonly string[];
}) {
  return selectProductArticles(getArticles(), product);
}
