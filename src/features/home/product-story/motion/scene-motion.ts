import type {
  SceneMeasurements,
  SceneVariables,
  StorySceneKind,
} from "../story.types";

export const clamp = (value: number) => Math.min(1, Math.max(0, value));
const range = (p: number, start: number, end: number) =>
  clamp((p - start) / (end - start));
const smooth = (p: number) => p * p * (3 - 2 * p);
const mix = (a: number, b: number, p: number) => a + (b - a) * p;

// Timings are local to this feature. Components and editorial content do not own motion math.
export function getSceneVariables(
  kind: StorySceneKind,
  p: number,
  { travel, itemCount }: SceneMeasurements,
): SceneVariables {
  switch (kind) {
    case "production": {
      const position = p * itemCount;
      const index = Math.min(itemCount - 1, Math.floor(position));
      const phase = position - index;
      const result: SceneVariables = {};
      for (let i = 0; i < itemCount; i++) {
        const alpha =
          i === index
            ? index === 0
              ? 1
              : smooth(range(phase, 0, 0.16))
            : i === index - 1
              ? 1 - smooth(range(phase, 0, 0.16))
              : 0;
        result[`--step-${i}-opacity`] = String(alpha);
        result[`--step-${i}-y`] =
          `${(i === index ? 1 : -1) * (1 - alpha) * 32}px`;
        result[`--counter-${i}-opacity`] = String(i === index ? 1 : 0);
      }
      return result;
    }
    case "ritual": {
      const t = smooth(range(p, 0.12, 0.85));
      return {
        "--media-left": `${mix(25, 0, t)}%`,
        "--media-top": `${mix(65, 0, t)}%`,
        "--media-width": `${mix(50, 100, t)}%`,
        "--media-height": `${mix(40, 100, t)}%`,
        "--media-radius": `${5 * (1 - t)}px`,
      };
    }
    case "journey":
      return { "--journey-x": `${-p * travel}px` };
  }
}
