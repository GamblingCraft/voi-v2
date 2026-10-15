import { getCatalogProducts } from "@/features/catalog/catalog.content";
import { CatalogCard } from "@/features/catalog/components/catalog-card";
import styles from "../article.module.css";

export function ArticleProduct({ productId }: { productId: string }) {
  const product = getCatalogProducts().find((item) => item.id === productId);
  if (!product) return null;
  return (
    <aside
      className={styles.product}
      aria-label={`Товар в статье: ${product.name}`}
    >
      <div>
        <p className={styles.productLabel}>Лёд для этой подачи</p>
        <p>{product.description}</p>
      </div>
      <CatalogCard product={product} compact />
    </aside>
  );
}
