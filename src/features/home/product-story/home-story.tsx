import type { ReactNode } from "react";
import { productStoryContent } from "./product-story.content";
import { ServingRitual } from "./sections/serving-ritual";
import { WaterJourney } from "./sections/water-journey";
import { StoryFinale } from "./sections/story-finale";
import styles from "./product-story.module.css";
import closing from "./sections/story-closing.module.css";

export function HomeStory({ children }: { children: ReactNode }) {
  return (
    <div className={styles.story}>
      <ServingRitual content={productStoryContent.ritual} />
      <WaterJourney content={productStoryContent.journey} />
      <div className={closing.closing}>
        <div className={closing.backdrop}>
          <StoryFinale content={productStoryContent.finale} />
        </div>
        <div className={closing.foreground}>{children}</div>
      </div>
    </div>
  );
}
