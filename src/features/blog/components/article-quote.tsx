import { ArticleAuthor } from "./article-author";
import styles from "./article-quote.module.css";

export function ArticleQuote({ text }: { text: string }) {
  return (
    <figure className={styles.quote}>
      <span className={styles.mark} aria-hidden="true">
        “
      </span>
      <blockquote>{text}</blockquote>
      <figcaption>
        <ArticleAuthor compact />
      </figcaption>
    </figure>
  );
}
