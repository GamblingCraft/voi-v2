import type { CatalogProduct } from "../../catalog-model";
import type { BlogArticle } from "@/features/blog/article-relations";
import { ProductVariantProvider } from "./product-variant";
import { ProductHero } from "./product-hero";
import { ProductDelivery } from "./product-delivery";
import { ProductDescription } from "./product-description";
import { ProductSections } from "./product-sections";
import { ProductArticles } from "./product-articles";
import { ProductFeedback } from "./product-feedback";

export function ProductDetails({
  product,
  articles,
}: {
  product: CatalogProduct;
  articles: BlogArticle[];
}) {
  return (
    <ProductVariantProvider>
      <ProductHero product={product}>
        <ProductDelivery />
      </ProductHero>
      <ProductSections
        panels={[
          {
            label: "Описание",
            content: (
              <ProductDescription product={product} articles={articles} />
            ),
          },
          {
            label: "Рецепты",
            content: (
              <>
                <h2>Рецепты</h2>
                <ProductArticles articles={articles} recipes />
              </>
            ),
          },
          {
            label: "Отзывы",
            content: <ProductFeedback productId={product.id} mode="review" />,
          },
          {
            label: "Вопросы",
            content: <ProductFeedback productId={product.id} mode="question" />,
          },
        ]}
      />
    </ProductVariantProvider>
  );
}
