import { FaqSection } from "@/features/content/components/faq-section";
import { JournalHero } from "./components/journal-hero";
import Link from "next/link";
import { BreadcrumbSeparator } from "@/components/ui/breadcrumb-separator";
import { getArticles } from "./articles";
import { selectArticles } from "./blog-model";
import { blogTopicHref, blogTopicSlugs, type BlogTopic } from "./blog-topics";
import { ArticleCard } from "./components/article-card";
import { BlogSearch } from "./components/blog-search";
import styles from "./blog.module.css";

export function BlogPage({ query, topic }: { query: string; topic: string }) {
  const articles = getArticles();
  const topics = [...new Set(articles.map((article) => article.topic))];
  const activeTopic =
    topics.find((label) => blogTopicSlugs[label] === topic) ?? "";
  const selected = selectArticles(articles, query, activeTopic);
  const filtered = Boolean(query || activeTopic);
  const tabs: (BlogTopic | "")[] = ["", ...topics];
  return (
    <main
      id="top"
      className={`${styles.page} ${styles.journalPage}`}
      data-header-theme="light"
    >
      {!filtered && <JournalHero articles={articles.slice(0, 3)} />}
      <div className={styles.journalContent}>
        <nav className={styles.breadcrumb} aria-label="Хлебные крошки">
          <Link href="/">Главная</Link>
          <BreadcrumbSeparator />
          <span aria-current="page">Журнал</span>
        </nav>
        <header className={styles.heading}>
          <h1>Журнал ВОЙ</h1>
          <p>Лёд, подача и работа за баром.</p>
        </header>
        <section
          id="articles"
          className={styles.articles}
          aria-labelledby="articles-heading"
        >
          <div className={styles.sectionHeading}>
            <h2 id="articles-heading">Статьи</h2>
          </div>
          <BlogSearch
            query={query}
            topic={activeTopic ? blogTopicSlugs[activeTopic] : ""}
          />
          <nav className={styles.filters} aria-label="Темы блога">
            {tabs.map((value) => (
              <Link
                key={value}
                href={blogTopicHref(value, query)}
                aria-current={activeTopic === value ? "page" : undefined}
              >
                {value || "Все"}
              </Link>
            ))}
          </nav>
          {selected.length ? (
            <>
              <div className={styles.grid}>
                {selected.slice(0, 3).map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
              {!filtered && (
                <aside className={styles.banner}>
                  <div>
                    <p>От идеи — к выбору</p>
                    <h2>Лёд, который подходит вашей подаче</h2>
                  </div>
                  <Link
                    data-ui-action
                    href="/catalog"
                    className={styles.button}
                  >
                    Перейти в каталог
                  </Link>
                </aside>
              )}
              {selected.length > 3 && (
                <div className={styles.grid}>
                  {selected.slice(3).map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className={styles.empty}>
              <h2>Пока ничего не нашлось</h2>
            </div>
          )}
        </section>
      </div>
      <FaqSection />
    </main>
  );
}
