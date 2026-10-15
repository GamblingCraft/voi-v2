import * as THREE from "three";

/** Shared film surface: u runs across the artwork, v from the foot to the seal. */
export function zipPanelPoint(
  w: number,
  h: number,
  depth: number,
  u: number,
  v: number,
  side: number,
  refined = true,
) {
  const a = 2 * u - 1;
  const across = Math.sin(Math.PI * u);
  // The lateral weld stays flat. Most of the width belongs to the broad panels.
  const inner = THREE.MathUtils.clamp((u - 0.025) / 0.95, 0, 1);
  const arch = Math.pow(Math.max(0, Math.sin(Math.PI * inner)), 0.62);
  // A doy-pack opens at its foot, not at mid-height like a pillow bag.
  const taper = Math.pow(1 - THREE.MathUtils.smoothstep(v, 0, 0.875), 0.72);
  let z = 0.008 + depth * 0.5 * arch * taper;
  const width = 0.955 + 0.045 * THREE.MathUtils.smoothstep(v, 0, 0.65);
  const corner = 1 - 0.025 * Math.pow(Math.abs(2 * v - 1), 28);
  const notch = 0.025 * Math.max(0, 1 - Math.abs(v - 0.953125) / 0.009);
  const x = a * (w * 0.5 * width * corner - notch);
  const y = (v - 0.5) * h + 0.065 * (1 - across) * Math.exp(-v * 16);
  if (refined) {
    const edgeDistance = Math.min(u, 1 - u);
    const shoulderLine = 0.84 - 0.32 * edgeDistance;
    const shoulder = Math.exp(-Math.pow((v - shoulderLine) / 0.025, 2));
    const footLine = 0.04 + 0.42 * edgeDistance;
    const foot = Math.exp(-Math.pow((v - footLine) / 0.032, 2));
    // Broad tension creases terminate at the weld; avoid corrugated film noise.
    const envelope = arch * Math.sin(Math.PI * Math.min(v / 0.875, 1));
    z +=
      envelope *
      (-0.025 * shoulder -
        0.018 * foot +
        0.005 * Math.sin(u * 19 + v * 11) * Math.exp(-edgeDistance * 7));
  }
  return new THREE.Vector3(x, y, side * z);
}
