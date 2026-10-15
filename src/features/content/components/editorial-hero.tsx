import { IntrinsicImage } from "@/components/media/intrinsic-image";
import { ArrowLink } from "@/components/ui/arrow-link";
type Props = {
  label: string;
  title: string[];
  description: string;
  href: string;
  cta: string;
  introduction: string[];
  media?: readonly string[];
};
export function EditorialHero({
  label,
  title,
  description,
  href,
  cta,
  introduction,
  media,
}: Props) {
  return (
    <>
      <section className="voi-editorial-hero">
        <IntrinsicImage
          src={media?.[0] ?? "/media/product/hero/1.webp"}
          alt={label}
        />
        <div>
          <h1 className="voi-display">
            {title.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </h1>
          <ArrowLink href={href}>{cta}</ArrowLink>
        </div>
      </section>
      <section className="voi-introduction voi-paper">
        <small>{label}</small>
        <h2>
          {introduction.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </h2>
        <p>{description}</p>
      </section>
    </>
  );
}
