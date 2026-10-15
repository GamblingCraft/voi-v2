export const SCENE_LOADING_EVENT = "voi:scene-loading";
export type SceneLoadingState = {
  progress: number;
  status: string;
  failed?: boolean;
};

// Preparation progress counts completed work, never elapsed time. Texture
// completion includes decoding and upload; the final 5% belongs to rendering.
export function createSceneLoadingTracker(
  report: (state: SceneLoadingState) => void,
) {
  const weights: Record<string, number> = {
    runtime: 10,
    fonts: 5,
    renderer: 5,
    textures: 60,
    environment: 10,
    models: 5,
    frame: 5,
  };
  const completed: Record<string, number> = {};
  return (task: string, fraction: number, status: string) => {
    if (!(task in weights)) throw new Error(`Unknown scene task: ${task}`);
    completed[task] = Math.max(
      completed[task] ?? 0,
      Math.min(1, Math.max(0, fraction)),
    );
    const progress = Math.floor(
      Object.entries(completed).reduce(
        (total, [key, value]) => total + weights[key] * value,
        0,
      ),
    );
    report({ progress, status });
  };
}

export function reportSceneLoading(state: SceneLoadingState) {
  window.dispatchEvent(new CustomEvent(SCENE_LOADING_EVENT, { detail: state }));
}
