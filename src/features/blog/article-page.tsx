import { FaqSection } from "@/features/content/components/faq-section";
import { ArticleAuthor } from "./components/article-author";
import { ArticleQuote } from "./components/article-quote";
import Image from "next/image";
import Link from "next/link";
import { BreadcrumbSeparator } from "@/components/ui/breadcrumb-separator";
import { siteUrl } from "@/lib/seo";
import type { Article } from "./blog.types";
import { getArticles } from "./articles";
import { ArticleMeta } from "./components/article-meta";
import { ArticleCard } from "./components/article-card";
import { ArticleShare } from "./components/article-share";
import { ArticleContents } from "./components/article-contents";
import { articleStructuredData } from "./article-schema";
import { RecipeSummary, RecipeContent } from "./components/recipe-content";
import { ArticleProduct } from "./components/article-product";
import shared from "./blog.module.css";
import styles from "./article.module.css";

export function ArticlePage({ article }: { article: Article }) {
  const related = getArticles()
    .filter((item) => item.slug !== article.slug)
    .sort(
      (a, b) =>
        Number(b.topic === article.topic) - Number(a.topic === article.topic),
    )
    .slice(0, 3);
  const data = articleStructuredData(article, siteUrl);
  return (
    <main id="top" className={shared.page} data-header-theme="light">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(data).replace(/</g, "\\u003c"),
        }}
      />
      <nav className={shared.breadcrumb} aria-label="Хлебные крошки">
        <Link href="/">Главная</Link>
        <BreadcrumbSeparator />
        <Link href="/blog">Журнал</Link>
        <BreadcrumbSeparator />
        <span aria-current="page">{article.topic}</span>
      </nav>
      <article>
        <header className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>{article.title}</h1>
            <p className={styles.intro}>{article.excerpt}</p>
          </div>
          <div className={styles.cover}>
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              sizes="(max-width: 800px) 100vw, 45vw"
              priority
            />
          </div>
          <div className={styles.heroDetails}>
            <ArticleMeta article={article} />
            <ArticleShare />
            {article.recipe && <RecipeSummary recipe={article.recipe} />}
            <ArticleAuthor />
          </div>
        </header>
        <div className={styles.layout}>
          <div className={styles.prose}>
            {article.sections.map((section, index) => (
              <section id={section.id} key={section.id}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {article.recipe && section.recipePart && (
                  <RecipeContent
                    recipe={article.recipe}
                    part={section.recipePart}
                  />
                )}
                {section.bullets && (
                  <ul>
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.note && <ArticleQuote text={section.note} />}
                {section.productId && (
                  <ArticleProduct productId={section.productId} />
                )}
                {index === 1 && article.kind !== "recipe" && (
                  <div className={styles.inlineBanner}>
                    <h3>Форма для вашей идеи</h3>
                    <p>
                      Посмотрите ассортимент ВОЙ и обсудите подходящий вариант.
                    </p>
                    <Link
                      data-ui-action
                      href="/catalog"
                      className={shared.button}
                    >
                      Открыть каталог
                    </Link>
                  </div>
                )}
              </section>
            ))}
            <div className={styles.articleEnd}>
              {article.source && (
                <p>
                  Основа рецепта:{" "}
                  <a
                    href={article.source.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {article.source.label}
                  </a>
                  .
                </p>
              )}
              <p>Остались вопросы по выбору или заказу?</p>
              <Link href="/contacts#inquiry">Написать ВОЙ</Link>
            </div>
          </div>
          <ArticleContents article={article} />
        </div>
      </article>
      <section className={styles.related} aria-labelledby="related-heading">
        <h2 id="related-heading">Читайте также</h2>
        <div className={shared.grid}>
          {related.map((item) => (
            <ArticleCard key={item.slug} article={item} />
          ))}
        </div>
      </section>
      <FaqSection />
    </main>
  );
}
