import * as THREE from "three";

// A screen-aligned plane lets the incoming DOM surface cover the outgoing
// product even though all three products share a single foreground canvas.
export function createProductClip(object: THREE.Object3D) {
  const plane = new THREE.Plane();
  const materials = new Set<THREE.Material>();
  const bind = () =>
    object.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;
      for (const material of Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material]) {
        if (materials.has(material)) continue;
        materials.add(material);
        material.clippingPlanes = [plane];
        material.needsUpdate = true;
      }
    });
  const left = new THREE.Vector3(),
    right = new THREE.Vector3(),
    up = new THREE.Vector3();
  return (camera: THREE.Camera, viewport: DOMRect, cutoff: number) => {
    bind();
    const y = 1 - ((cutoff - viewport.top) / viewport.height) * 2;
    left.set(-1, y, 0.5).unproject(camera);
    right.set(1, y, 0.5).unproject(camera);
    plane.setFromCoplanarPoints(camera.position, right, left);
    up.set(0, 1, 0).applyQuaternion(camera.quaternion);
    if (plane.normal.dot(up) < 0) plane.negate();
  };
}
