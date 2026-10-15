import clsx from "clsx";
import styles from "../product-story.module.css";

type StoryHeadingProps = {
  lines: string | string[];
  className?: string;
};

export function StoryHeading({ lines, className }: StoryHeadingProps) {
  return (
    <h2 className={clsx(styles.heading, className)}>
      {(Array.isArray(lines) ? lines : [lines]).map((line) => (
        <span key={line}>{line} </span>
      ))}
    </h2>
  );
}
