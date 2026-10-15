"use client";
import { IntrinsicImage } from "@/components/media/intrinsic-image";
import Link from "next/link";
import { useState } from "react";
import type { Article } from "../blog.types";
export function JournalHero({ articles }: { articles: Article[] }) {
  const [index, setIndex] = useState(0);
  const article = articles[index];
  if (!article) return null;
  return (
    <section className="voi-journal-hero">
      <IntrinsicImage src={article.image} alt={article.imageAlt} />
      <div className="voi-journal-hero-content">
        <small>{article.topic}</small>
        <h1>{article.title}</h1>
        <Link href={`/blog/${article.slug}`}>Читать статью →</Link>
      </div>
      <div className="voi-journal-controls">
        <button
          aria-label="Предыдущая статья"
          onClick={() =>
            setIndex((index + articles.length - 1) % articles.length)
          }
        >
          ←
        </button>
        {articles.map((a, i) => (
          <button
            aria-label={a.title}
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
            key={a.slug}
          >
            <IntrinsicImage src={a.image} alt="" />
          </button>
        ))}
        <button
          aria-label="Следующая статья"
          onClick={() => setIndex((index + 1) % articles.length)}
        >
          →
        </button>
      </div>
    </section>
  );
}
