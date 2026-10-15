export const blogTopicSlugs = {
  Рецепты: "recepty",
  "Гид по льду": "gid-po-ldu",
  События: "sobytiya",
  Практика: "praktika",
  "Для бизнеса": "dlya-biznesa",
} as const;

export type BlogTopic = keyof typeof blogTopicSlugs;

export function blogTopicHref(topic: BlogTopic | "", query = "") {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (topic) params.set("topic", blogTopicSlugs[topic]);
  return `/blog${params.size ? `?${params}` : ""}#articles`;
}
