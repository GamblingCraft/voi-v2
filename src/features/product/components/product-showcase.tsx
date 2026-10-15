import type { CatalogProduct } from "@/features/catalog/catalog-model";
import type { ModelKind } from "@/lib/three/types";

export function ProductShowcase({
  kind,
}: {
  kind: ModelKind;
  product: CatalogProduct;
}) {
  return (
    <div id={`${kind}-showcase`} aria-hidden="true">
      <div id={`${kind}-model-target`} aria-hidden="true" />
      <div id={`${kind}-product-card`} hidden style={{ display: "none" }} />
    </div>
  );
}
