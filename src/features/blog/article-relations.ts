export type BlogArticle = {
  slug: string;
  title: string;
  excerpt: string;
  kind: "recipe" | "guide";
  status: "draft" | "published";
  tags: string[];
  productIds: string[];
};

// An explicit product relation takes priority; shared tags broaden discovery.
export function selectProductArticles(
  articles: readonly BlogArticle[],
  product: { id: string; tags: readonly string[] },
) {
  return articles
    .filter(
      (article) =>
        article.status === "published" &&
        (article.productIds.includes(product.id) ||
          article.tags.some((tag) => product.tags.includes(tag))),
    )
    .sort(
      (a, b) =>
        Number(b.productIds.includes(product.id)) -
        Number(a.productIds.includes(product.id)),
    );
}
