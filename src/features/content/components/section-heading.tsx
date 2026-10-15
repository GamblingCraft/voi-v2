import headingStyles from "./section-heading.module.css";

export function SectionHeading({
  label,
  title,
}: {
  label: string;
  title: React.ReactNode;
}) {
  return (
    <div className={headingStyles.sectionHeading}>
      <p className={headingStyles.sectionLabel}>{label}</p>
      <h2>{title}</h2>
    </div>
  );
}
