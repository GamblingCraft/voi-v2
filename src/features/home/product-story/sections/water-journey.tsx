import Image from "next/image";
import type { ProductStoryContent } from "../story.types";
import { ScrollScene } from "../components/scroll-scene";
import styles from "./water-journey.module.css";

export function WaterJourney({
  content,
}: {
  content: ProductStoryContent["journey"];
}) {
  return (
    <ScrollScene
      kind="journey"
      id="water-journey"
      label={content.ariaLabel}
      itemCount={content.chapters.length}
      screenClassName={styles.screen}
    >
      <div className={styles.track} data-story-track>
        {content.chapters.map((chapter) => (
          <article
            key={chapter.id}
            className={styles.chapter}
            data-journey-chapter={chapter.id}
            aria-labelledby={`journey-${chapter.id}`}
          >
            <div className={styles.content}>
              <h2 id={`journey-${chapter.id}`}>
                {chapter.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <p>{chapter.description}</p>
            </div>
            <figure className={styles.media}>
              <Image
                src={chapter.image}
                alt={chapter.alt}
                fill
                sizes="(max-width: 700px) 90vw, 66vw"
                className={styles.image}
              />
            </figure>
          </article>
        ))}
        <svg
          className={styles.line}
          viewBox="0 0 5000 300"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 220C200 220 230 0 410 140S630 290 800 170S1040 260 1210 180S1420 70 1580 130S1800 310 2000 150S2290 80 2450 150S2740 280 3000 160S3290 60 3500 160S3790 290 4000 160S4290 60 4500 170S4790 280 5000 160" />
        </svg>
      </div>
    </ScrollScene>
  );
}
