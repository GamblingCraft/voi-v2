import "server-only";
import type { ProductId } from "../catalog-model";

type PublishedProductReview = {
  id: string;
  productId: ProductId;
  author: string;
  rating: number;
  text: string;
  answer?: string;
};

// Public demonstration content, not real customer reviews or aggregate-rating data.
const demoReviews: PublishedProductReview[] = [
  {
    id: "cube-serving",
    productId: "cube",
    author: "Александр",
    rating: 5,
    text: "Брал кубики для домашних коктейлей. В низком бокале смотрятся аккуратно, подача понравилась. В следующий раз хочу попробовать сферу.",
    answer:
      "Александр, спасибо за отзыв! Если будете выбирать сферу, обратите внимание на внутренний диаметр бокала — поможем подобрать подходящую форму.",
  },
  {
    id: "cube-evening",
    productId: "cube",
    author: "Мария",
    rating: 5,
    text: "Использовали для напитков на ужине с друзьями. Понравилось, как куб выглядит в прозрачном бокале. Взяла бы ещё.",
    answer:
      "Мария, благодарим за обратную связь! Рады, что лёд дополнил вашу подачу.",
  },
];

export function getPublishedProductReviews(productId: ProductId) {
  return demoReviews.filter((review) => review.productId === productId);
}
