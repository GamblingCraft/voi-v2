import { IntrinsicImage } from "@/components/media/intrinsic-image";
import Link from "next/link";
import { ArrowLink } from "@/components/ui/arrow-link";
import { blogArticles } from "@/features/blog/blog.content";
import { PhotoComposition } from "../photo-composition";
import { ProductOrbit } from "../product-orbit";
export function OriginStory() {
  return (
    <section className="voi-history">
      <h2 className="voi-display">
        Сотворён Байкалом
        <br />
        <em>воплощён в</em> искусство
        <br />
        подачи
      </h2>
      <ArrowLink href="/product">О льде ВОЙ</ArrowLink>
      <p className="voi-history-content">
        Премиальный лёд из байкальской воды для баров, ресторанов, отелей и
        событий. Собственное производство в Иркутске.
      </p>
      <PhotoComposition />
    </section>
  );
}
export function MagazineSection() {
  return (
    <section className="voi-magazine">
      <div className="voi-photo-ribbon">
        {Array.from({ length: 14 }, (_, i) => (
          <IntrinsicImage
            key={i}
            src={`/media/cooperation/${(i % 7) + 1}.webp`}
            alt="Культура подачи ВОЙ"
            loading="lazy"
          />
        ))}
      </div>
      <h2 className="voi-display">Мир ВОЙ</h2>
      <p>
        Лёд, подача и работа за баром.
        <br />
        Рецепты, формы льда и тонкости барной подачи.
      </p>
      <ArrowLink href="/blog">Журнал ВОЙ</ArrowLink>
      <div className="voi-photo-ribbon reverse">
        {Array.from({ length: 14 }, (_, i) => (
          <IntrinsicImage
            key={i}
            src={`/media/product/hero/${(i % 7) + 1}.webp`}
            alt="Лёд в напитках"
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
}
export function OrbitCatalog() {
  return (
    <ProductOrbit>
      <div className="voi-cloud-content">
        <h2 className="voi-display">
          Лёд <em>для</em>
          <br />
          вашей подачи
        </h2>
        <ArrowLink href="/catalog" id="orbit-catalog-link">
          Каталог ВОЙ
        </ArrowLink>
      </div>
    </ProductOrbit>
  );
}
export function HomeJournal() {
  return (
    <section className="voi-journal voi-paper">
      <div>
        <h2>
          Журнал
          <br />
          ВОЙ
        </h2>
        <p>
          Лёд, подача
          <br />и работа за баром.
        </p>
        <ArrowLink href="/blog">Читать журнал</ArrowLink>
      </div>
      {blogArticles
        .filter((a) => a.status === "published")
        .slice(0, 3)
        .map((a) => (
          <Link href={`/blog/${a.slug}`} key={a.slug}>
            <IntrinsicImage src={a.image} alt={a.imageAlt} loading="lazy" />
            <small>{a.topic}</small>
            <h3>{a.title}</h3>
          </Link>
        ))}
    </section>
  );
}
export function PartnerSection() {
  return (
    <section className="voi-partner">
      <h2 className="voi-display">
        Ваша подача
        <br />
        Наш лёд
        <br />
        <em>Станьте партнёром</em> ВОЙ
      </h2>
      <ArrowLink href="/cooperation">Сотрудничество</ArrowLink>
      <IntrinsicImage src="/media/cooperation/4.webp" alt="" loading="lazy" />
      <IntrinsicImage src="/media/cooperation/6.webp" alt="" loading="lazy" />
    </section>
  );
}
