import type { ProductStoryContent } from "../story.types";
import { ScrollScene } from "../components/scroll-scene";
import { StoryHeading } from "../components/story-heading";
import { ViewportVideo } from "../components/viewport-video";
import styles from "./serving-ritual.module.css";

export function ServingRitual({
  content,
}: {
  content: ProductStoryContent["ritual"];
}) {
  return (
    <ScrollScene kind="ritual" id="serving-ritual" label={content.title}>
      <div className={styles.title}>
        <StoryHeading lines={content.title} />
      </div>
      <div className={styles.media}>
        <ViewportVideo
          className={styles.video}
          src="/media/start/section_start.mp4"
          label="Подача напитков со льдом ВОЙ"
        />
      </div>
    </ScrollScene>
  );
}
