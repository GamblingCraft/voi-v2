import type { ProductStoryContent } from "../story.types";
import { StoryMedia } from "../components/story-media";
import { StoryHeading } from "../components/story-heading";
import shared from "../product-story.module.css";
import styles from "./story-finale.module.css";

export function StoryFinale({
  content,
}: {
  content: ProductStoryContent["finale"];
}) {
  return (
    <section
      className={styles.section}
      aria-label={content.title.join(" ")}
      data-header-theme="light"
    >
      <StoryHeading className={styles.title} lines={content.title} />
      <StoryMedia label={content.media} className={styles.city} />
      <p className={`${shared.content} ${styles.note}`}>{content.note}</p>
    </section>
  );
}
