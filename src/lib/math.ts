import type { VectorTuple } from "@/lib/three/types";
export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
export const lerp = (a: number, b: number, progress: number) =>
  a + (b - a) * progress;
export const blendVector = (
  a: readonly number[],
  b: readonly number[],
  progress: number,
): VectorTuple => [
  lerp(a[0], b[0], progress),
  lerp(a[1], b[1], progress),
  lerp(a[2], b[2], progress),
];
