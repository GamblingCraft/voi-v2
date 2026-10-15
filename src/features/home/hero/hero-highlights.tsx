import { IntrinsicImage } from "@/components/media/intrinsic-image";
import Link from "next/link";
export function HeroHighlights() {
  return (
    <div className="voi-highlights">
      <Link href="/catalog" className="highlight-catalog">
        Каталог <span>→</span>
      </Link>
      <Link href="/production" className="highlight-picture">
        <IntrinsicImage
          src="/media/production/hero/3.webp"
          alt="Производство льда ВОЙ"
        />
        <span>От воды до льда</span>
      </Link>
      <Link href="/catalog/formed" className="highlight-product">
        <IntrinsicImage
          src="/media/products/pack.png"
          alt="Формованный лёд ВОЙ"
        />
        <span>Формы льда</span>
      </Link>
      <Link href="/cooperation" className="highlight-story">
        <IntrinsicImage src="/media/products/sphere.png" alt="" />
        <div>
          Сотрудничество с ВОЙ
          <p>Для баров, ресторанов, отелей и событий.</p>
        </div>
        <span>→</span>
      </Link>
    </div>
  );
}
