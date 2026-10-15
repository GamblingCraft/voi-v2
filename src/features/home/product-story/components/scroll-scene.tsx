"use client";

import { useRef, type ReactNode } from "react";
import clsx from "clsx";
import type { StorySceneKind } from "../story.types";
import { useScrollScene } from "../motion/use-scroll-scene";
import styles from "./scroll-scene.module.css";

type ScrollSceneProps = {
  kind: StorySceneKind;
  itemCount?: number;
  id?: string;
  label: string;
  theme?: "light" | "dark";
  screenClassName?: string;
  children: ReactNode;
  onProgress?: (progress: number) => void;
};

export function ScrollScene({
  kind,
  itemCount,
  id,
  label,
  theme = "light",
  screenClassName,
  children,
  onProgress,
}: ScrollSceneProps) {
  const sceneRef = useRef<HTMLElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const frozen = useScrollScene({
    sceneRef,
    screenRef,
    kind,
    itemCount,
    onProgress,
  });

  return (
    <section
      ref={sceneRef}
      id={id}
      className={clsx(styles.scene, styles[kind])}
      aria-label={label}
      data-story-scene={kind}
      data-header-theme={theme}
      data-frozen={frozen || undefined}
    >
      <div
        ref={screenRef}
        className={clsx(styles.screen, screenClassName)}
        tabIndex={kind === "journey" ? 0 : undefined}
      >
        {children}
      </div>
    </section>
  );
}
