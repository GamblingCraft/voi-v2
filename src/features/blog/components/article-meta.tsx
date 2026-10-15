import { articleDate, articleMinutes } from "../blog-model";
import { Calendar, Clock } from "@deemlol/next-icons";
import type { Article } from "../blog.types";
import styles from "../blog.module.css";
export function ArticleMeta({ article }: { article: Article }) {
  return (
    <div className={styles.meta}>
      <time dateTime={article.date}>
        <Calendar size={16} strokeWidth={1.5} aria-hidden="true" />
        {articleDate(article.date)}
      </time>
      <span>
        <Clock size={16} strokeWidth={1.5} aria-hidden="true" />
        {articleMinutes(article)} мин чтения
      </span>
    </div>
  );
}
