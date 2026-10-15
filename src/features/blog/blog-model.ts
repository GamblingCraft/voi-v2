import type { Article } from "./blog.types";

export function selectArticles(
  articles: readonly Article[],
  query: string,
  topic: string,
) {
  const search = query.trim().toLocaleLowerCase("ru");
  return articles.filter(
    (article) =>
      article.status === "published" &&
      (!topic || article.topic === topic) &&
      [
        article.title,
        article.excerpt,
        ...article.tags,
        ...(article.recipe?.ingredients ?? []),
        ...(article.recipe?.steps.flatMap((step) => [step.title, step.text]) ??
          []),
        ...article.sections.flatMap((section) => [
          section.title,
          ...section.paragraphs,
        ]),
      ]
        .join(" ")
        .toLocaleLowerCase("ru")
        .includes(search),
  );
}
export function articleMinutes(article: Article) {
  const text = [
    article.excerpt,
    ...(article.recipe?.ingredients ?? []),
    ...(article.recipe?.steps.flatMap((step) => [step.title, step.text]) ?? []),
    ...article.sections.flatMap((section) => [
      section.title,
      ...section.paragraphs,
      ...(section.bullets ?? []),
      section.note ?? "",
    ]),
  ].join(" ");
  return Math.max(1, Math.ceil(text.trim().split(/\s+/u).length / 180));
}
export function articleDate(date: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
