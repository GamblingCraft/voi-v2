import type { productStoryContent } from "./product-story.content";

export type ProductStoryContent = typeof productStoryContent;
export type StorySceneKind = "production" | "ritual" | "journey";
export type SceneMeasurements = {
  width: number;
  height: number;
  travel: number;
  itemCount: number;
};
export type SceneVariables = Record<`--${string}`, string>;
