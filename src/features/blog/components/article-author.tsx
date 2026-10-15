import Image from "next/image";
import styles from "./article-author.module.css";

export function ArticleAuthor({ compact = false }: { compact?: boolean }) {
  return (
    <div className={styles.author} data-compact={compact || undefined}>
      <span className={styles.avatar}>
        <Image src="/brand/logo-trimmed.svg" alt="" width={32} height={32} />
      </span>
      <div className={styles.identity}>
        <span className={styles.name}>Редакция ВОЙ</span>
        {!compact && (
          <span className={styles.description}>О льде и культуре подачи</span>
        )}
      </div>
    </div>
  );
}
