import type { CatalogProduct } from "../../catalog-model";
import type { BlogArticle } from "@/features/blog/article-relations";
import { ProductArticles } from "./product-articles";
import { ProductWeightText } from "./product-variant";
import descriptionStyles from "./product-description.module.css";
export function ProductDescription({
  product,
  articles,
}: {
  product: CatalogProduct;
  articles: BlogArticle[];
}) {
  return (
    <div className={descriptionStyles.details}>
      <section aria-labelledby="product-description">
        <h2 id="product-description">Состав</h2>
        <p>Вода питьевая подготовленная.</p>
        <p>Для приготовления холодных блюд и напитков.</p>
      </section>
      <section
        className={descriptionStyles.characteristics}
        aria-labelledby="product-specifications"
      >
        <h2 id="product-specifications">Характеристики</h2>
        <dl className={descriptionStyles.specs}>
          <div>
            <dt>Форма</dt>
            <dd>{product.form}</dd>
          </div>
          <div>
            <dt>Масса нетто</dt>
            <dd>
              <ProductWeightText />
            </dd>
          </div>
          <div>
            <dt>Условия хранения</dt>
            <dd>При температуре не выше −18 °C</dd>
          </div>
          <div>
            <dt>После вскрытия упаковки</dt>
            <dd>Не более 12 часов при той же температуре</dd>
          </div>
        </dl>
      </section>
      <section
        className={descriptionStyles.application}
        aria-labelledby="product-application"
      >
        <h2 id="product-application">Способы применения</h2>
        <ProductArticles articles={articles} />
      </section>
    </div>
  );
}
