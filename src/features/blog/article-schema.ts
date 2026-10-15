import type { Article } from "./blog.types";

export function articleStructuredData(article: Article, siteUrl: URL) {
  const url = new URL(`/blog/${article.slug}`, siteUrl).href;
  const author = {
    "@type": "Organization",
    name: "Редакция ВОЙ",
    url: new URL("/contacts", siteUrl).href,
  };
  const posting = {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author,
    publisher: { "@type": "Organization", name: "ВОЙ", url: siteUrl.href },
    image: new URL(article.image, siteUrl).href,
    mainEntityOfPage: url,
    ...(article.source ? { citation: article.source.href } : {}),
  };
  const recipe = article.recipe;
  return {
    "@context": "https://schema.org",
    "@graph": [
      posting,
      ...(recipe
        ? [
            {
              "@type": "Recipe",
              "@id": `${url}#recipe`,
              name: article.title,
              description: article.excerpt,
              author,
              datePublished: article.date,
              recipeCategory: "Коктейль",
              recipeYield: recipe.yield,
              ...(recipe.image
                ? { image: new URL(recipe.image, siteUrl).href }
                : {}),
              recipeIngredient: recipe.ingredients,
              recipeInstructions: recipe.steps.map((step) => ({
                "@type": "HowToStep",
                name: step.title,
                text: step.text,
                url: `${url}#${step.id}`,
              })),
              isPartOf: { "@id": `${url}#article` },
              ...(article.source ? { isBasedOn: article.source.href } : {}),
            },
          ]
        : []),
    ],
  };
}
