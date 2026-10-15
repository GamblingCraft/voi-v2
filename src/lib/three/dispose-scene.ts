import { Mesh, type Object3D, type Material } from "three";

export function disposeScene(root: Object3D) {
  const materials = new Set<Material>();
  root.traverse((node) => {
    if (!(node instanceof Mesh)) return;
    node.geometry.dispose();
    for (const material of Array.isArray(node.material)
      ? node.material
      : [node.material])
      materials.add(material);
  });
  for (const material of materials) material.dispose();
}
