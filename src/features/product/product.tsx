import { IntrinsicImage } from "@/components/media/intrinsic-image";
import "./styles/index.css";
import "./styles/ornament.css";
import type { ReactNode } from "react";
import type { CatalogProduct } from "@/features/catalog/catalog-model";
import { ProductScenes } from "./components/product-scenes";
import { ProductShowcase } from "./components/product-showcase";
import { ArrowLink } from "@/components/ui/arrow-link";
import { BrandStory } from "./components/brand-story";
import { ProductOrnament } from "./components/product-ornament";
import { ZipStory } from "./components/zip-story";
import { ZipStage } from "./components/zip-stage";
import { PvdStory } from "./components/pvd-story";
import { PvdStage } from "./components/pvd-stage";
import { CupStory } from "./components/cup-story";
import { CupStage } from "./components/cup-stage";
import { ClosingStory } from "./components/closing-story";
import { ProductGuide } from "./components/product-guide";

// Packaging geometry is independent of the shared catalog and cart data.
const slots = [
  { kind: "zip", productId: "cube" },
  { kind: "pvd", productId: "sphere" },
  { kind: "cup", productId: "cylinder" },
] as const;

export function Product({
  footer,
  products,
}: {
  footer: ReactNode;
  products: CatalogProduct[];
}) {
  return (
    <ProductScenes
      details={<ProductGuide />}
      hero={
        <section
          id="hero"
          className="voi-editorial-hero"
          aria-labelledby="product-hero-title"
        >
          <IntrinsicImage src="/media/product/hero/1.webp" alt="Лёд ВОЙ" />
          <div>
            <h1 id="product-hero-title" className="voi-display">
              <span>Сотворён Байкалом</span>
              <span>Воплощён в искусство подачи</span>
            </h1>
            <ArrowLink href="/catalog">Выбрать лёд</ArrowLink>
          </div>
        </section>
      }
      footer={footer}
      showcases={slots.map(({ kind, productId }) => {
        const product = products.find((item) => item.id === productId);
        return product ? (
          <ProductShowcase key={kind} kind={kind} product={product} />
        ) : null;
      })}
    >
      <div id="voi-cloud-transition" aria-hidden="true" />
      <div className="voi-ornament-scene">
        <ProductOrnament />
        <BrandStory />
        <ZipStory />
      </div>
      <ZipStage />
      <PvdStory />
      <PvdStage />
      <CupStory />
      <CupStage />
      <ClosingStory />
    </ProductScenes>
  );
}
