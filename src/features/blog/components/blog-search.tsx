import { Search } from "@deemlol/next-icons";
import styles from "../blog.module.css";
export function BlogSearch({
  query = "",
  topic = "",
}: {
  query?: string;
  topic?: string;
}) {
  return (
    <form
      action="/blog"
      method="get"
      role="search"
      aria-label="Поиск по блогу"
      className={styles.search}
    >
      <input
        type="search"
        name="q"
        aria-label="Поиск по блогу"
        placeholder="Поиск по блогу"
        defaultValue={query}
        maxLength={200}
      />
      {topic && <input type="hidden" name="topic" value={topic} />}
      <button type="submit" aria-label="Найти статьи">
        <Search size={20} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </form>
  );
}
