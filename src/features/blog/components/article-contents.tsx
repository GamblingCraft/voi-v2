import Link from "next/link";
import type { Article } from "../blog.types";
import { blogTopicHref } from "../blog-topics";
import styles from "../article.module.css";
export function ArticleContents({ article }: { article: Article }) {
  return (
    <aside className={styles.sidebar}>
      <nav aria-label="Содержание статьи">
        <h2>Содержание</h2>
        <ol>
          {article.sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.title}</a>
            </li>
          ))}
        </ol>
      </nav>
      <div className={styles.topics}>
        <h2>Тема</h2>
        <Link href={blogTopicHref(article.topic)}>{article.topic}</Link>
      </div>
      <Link className={styles.back} href="/blog">
        Вернуться в блог
      </Link>
    </aside>
  );
}
