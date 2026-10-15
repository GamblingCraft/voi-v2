import manifest from "@/lib/three/data/scene-assets.json";

export function sceneAsset(path: string) {
  return (manifest as Record<string, string>)[path] ?? path;
}
