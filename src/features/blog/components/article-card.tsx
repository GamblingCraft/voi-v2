import Image from "next/image";
import Link from "next/link";
import type { Article } from "../blog.types";
import { ArticleMeta } from "./article-meta";
import styles from "../blog.module.css";

export function ArticleCard({
  article,
  featured = false,
}: {
  article: Article;
  featured?: boolean;
}) {
  return (
    <article className={featured ? styles.featured : styles.card}>
      <Link
        className={styles.cover}
        href={`/blog/${article.slug}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={article.image}
          alt=""
          fill
          sizes={
            featured
              ? "(max-width: 700px) 100vw, 35vw"
              : "(max-width: 700px) 100vw, 33vw"
          }
        />
      </Link>
      <div className={styles.cardContent}>
        <ul className={styles.tags} aria-label="Темы">
          {[...new Set([article.topic, ...article.tags])]
            .slice(0, 3)
            .map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
        </ul>
        <h2>
          <Link href={`/blog/${article.slug}`}>{article.title}</Link>
        </h2>
        <p>{article.excerpt}</p>
        <ArticleMeta article={article} />
      </div>
    </article>
  );
}
