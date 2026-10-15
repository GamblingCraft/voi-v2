import * as THREE from "three";
export function packagingBounds(object: THREE.Object3D) {
  object.updateWorldMatrix(true, true);
  const box = new THREE.Box3(),
    inverse = object.matrixWorld.clone().invert(),
    instance = new THREE.Matrix4();
  object.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (!mesh.geometry) return;
    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
    const relative = inverse.clone().multiply(node.matrixWorld),
      geometryBox = mesh.geometry.boundingBox!;
    if ((mesh as THREE.InstancedMesh).isInstancedMesh) {
      const batch = mesh as THREE.InstancedMesh;
      for (let i = 0; i < batch.count; i++) {
        batch.getMatrixAt(i, instance);
        box.union(
          geometryBox.clone().applyMatrix4(relative.clone().multiply(instance)),
        );
      }
    } else box.union(geometryBox.clone().applyMatrix4(relative));
  });
  return box;
}
