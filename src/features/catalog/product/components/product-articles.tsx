import Link from "next/link";
import type { BlogArticle } from "@/features/blog/article-relations";
import articlesStyles from "./product-articles.module.css";
export function ProductArticles({
  articles,
  recipes = false,
}: {
  articles: BlogArticle[];
  recipes?: boolean;
}) {
  const selected = articles.filter(
    (article) => article.kind === (recipes ? "recipe" : "guide"),
  );
  return selected.length ? (
    <div className={articlesStyles.articles}>
      {selected.map((article) => (
        <Link key={article.slug} href={`/blog/${article.slug}`}>
          <h3>{article.title}</h3>
          <p>{article.excerpt}</p>
          <span>{recipes ? "Открыть рецепт" : "Читать статью"} </span>
        </Link>
      ))}
    </div>
  ) : (
    <p className={articlesStyles.empty}>
      {recipes
        ? "Рецептов с этим льдом пока нет."
        : "Материалы о применении этого льда появятся здесь."}
    </p>
  );
}
