import * as THREE from "three";
import { prepareSceneWorker } from "./scene-worker";

export function yieldScenePreparation() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => setTimeout(resolve, 0));
  });
}

export async function prepareFirstFrame(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  cancelled: () => boolean,
  onProgress?: (fraction: number) => void,
) {
  await yieldScenePreparation();
  if (cancelled()) return;
  const prepared = await prepareSceneWorker(renderer, scene, camera, cancelled);
  if (cancelled()) {
    prepared?.dispose();
    return;
  }
  if (prepared) {
    onProgress?.(0.9);
    return prepared;
  }
  // Preserve the existing renderer on browsers without worker WebGL support.
  await yieldScenePreparation();
  if (cancelled()) return;
  const start = performance.now();
  renderer.render(scene, camera);
  return {
    metrics: {
      worker: false,
      serializationMs: 0,
      frameMs: performance.now() - start,
      readyMs: performance.now() - start,
    },
    info: {
      geometries: renderer.info.memory.geometries,
      drawCalls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
    },
    dispose: () => {},
  };
}
