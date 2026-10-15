import type { BlogArticle } from "./article-relations";
import type { BlogTopic } from "./blog-topics";

export type ArticleSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  note?: string;
  productId?: string;
  recipePart?: "ingredients" | "steps";
};
export type Recipe = {
  yield: string;
  ingredients: string[];
  equipment: string[];
  steps: { id: string; title: string; text: string }[];
  image?: string;
};
export type Article = BlogArticle & {
  topic: BlogTopic;
  date: string;
  image: string;
  imageAlt: string;
  sections: ArticleSection[];
  source?: { label: string; href: string };
  recipe?: Recipe;
};
