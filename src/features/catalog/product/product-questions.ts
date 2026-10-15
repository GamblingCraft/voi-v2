import "server-only";
import type { ProductId } from "../catalog-model";

export type PublishedProductQuestion = {
  id: string;
  productId: ProductId;
  author: string;
  question: string;
  answer: { author: string; text: string };
};

// Public demo fixtures only. Pending submissions must never enter this dataset.
const demoQuestions: PublishedProductQuestion[] = [
  {
    id: "cube-composition",
    productId: "cube",
    author: "Александр",
    question: "Из чего сделан лёд? Можно добавлять кубики прямо в напиток?",
    answer: {
      author: "ВОЙ",
      text: "Да, это пищевой лёд для приготовления холодных блюд и напитков. Состав — вода питьевая подготовленная.",
    },
  },
  {
    id: "cube-storage",
    productId: "cube",
    author: "Мария",
    question: "Как хранить лёд, если упаковка уже открыта?",
    answer: {
      author: "ВОЙ",
      text: "После вскрытия упаковки храните лёд при температуре не выше −18 °C не более 12 часов.",
    },
  },
];

export function getPublishedProductQuestions(productId: ProductId) {
  return demoQuestions.filter((question) => question.productId === productId);
}
