import * as THREE from "three";
import type { ScenePacket, PosePacket } from "./scene-worker-protocol";

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
const camera = new THREE.PerspectiveCamera();
camera.matrixAutoUpdate = false;
camera.matrixWorldAutoUpdate = false;
const meshes = new Map<string, THREE.Mesh>();
const materialLookup = new Map<string, THREE.Material>();
let materials: THREE.Material[] = [];
let textures: THREE.Texture[] = [];
let geometries: THREE.BufferGeometry[] = [];

function rebuild(packet: ScenePacket) {
  for (const mesh of meshes.values())
    if ((mesh as THREE.InstancedMesh).isInstancedMesh)
      (mesh as THREE.InstancedMesh).dispose();
  materials.forEach((material) => material.dispose());
  textures.forEach((texture) => texture.dispose());
  geometries.forEach((geometry) => geometry.dispose());
  meshes.clear();
  scene = new THREE.Scene();
  const textureMap: Record<string, THREE.Texture> = {};
  for (const packetTexture of packet.textures) {
    const p = packetTexture.properties;
    const texture = packetTexture.compressed
      ? new THREE.CompressedTexture(
          packetTexture.mipmaps! as unknown as ImageData[],
          packetTexture.width,
          packetTexture.height,
          p.format as THREE.CompressedPixelFormat,
        )
      : new THREE.DataTexture(
          packetTexture.data!.slice(),
          packetTexture.width,
          packetTexture.height,
        );
    const keys = [
      "mapping",
      "format",
      "type",
      "encoding",
      "minFilter",
      "magFilter",
      "anisotropy",
      "generateMipmaps",
      "premultiplyAlpha",
      "unpackAlignment",
    ];
    Object.assign(
      texture,
      Object.fromEntries(keys.map((key) => [key, p[key]])),
    );
    texture.wrapS = p.wrap[0];
    texture.wrapT = p.wrap[1];
    texture.offset.fromArray(p.offset);
    texture.repeat.fromArray(p.repeat);
    texture.center.fromArray(p.center);
    texture.rotation = p.rotation;
    texture.flipY = false;
    texture.matrix.fromArray(packetTexture.matrix);
    texture.matrixAutoUpdate = packetTexture.matrixAutoUpdate;
    texture.needsUpdate = true;
    textureMap[packetTexture.uuid] = texture;
  }
  textures = Object.values(textureMap);
  const materialLoader = new THREE.MaterialLoader().setTextures(textureMap);
  const materialMap = new Map(
    packet.materials.map((m) => [m.uuid, materialLoader.parse(m)]),
  );
  materials = [...materialMap.values()];
  materialLookup.clear();
  for (const [uuid, material] of materialMap)
    materialLookup.set(uuid, material);
  const geometryLoader = new THREE.BufferGeometryLoader();
  const geometryMap = new Map(
    packet.geometries.map((g) => [g.uuid, geometryLoader.parse(g)]),
  );
  geometries = [...geometryMap.values()];
  for (const item of packet.meshes) {
    const meshMaterials = item.materials.map((uuid) => materialMap.get(uuid)!);
    const material = item.materialArray ? meshMaterials : meshMaterials[0];
    const geometry = geometryMap.get(item.geometry)!;
    const mesh =
      item.instanceCount === undefined
        ? new THREE.Mesh(geometry, material)
        : new THREE.InstancedMesh(geometry, material, item.instanceCount);
    if (item.instanceMatrix)
      ((mesh as THREE.InstancedMesh).instanceMatrix.array as Float32Array).set(
        item.instanceMatrix,
      );
    if (item.instanceColor)
      (mesh as THREE.InstancedMesh).instanceColor =
        new THREE.InstancedBufferAttribute(item.instanceColor, 3);
    mesh.name = item.name;
    mesh.renderOrder = item.renderOrder;
    mesh.matrixAutoUpdate = false;
    scene.add(mesh);
    meshes.set(item.uuid, mesh);
  }
  scene.environment = packet.environment
    ? textureMap[packet.environment]
    : null;
}

function render(pose: PosePacket) {
  renderer.localClippingEnabled = pose.localClipping;
  for (const item of pose.clipping) {
    const material = materialLookup.get(item.uuid);
    if (!material) continue;
    material.clippingPlanes = item.planes.map(
      (plane) =>
        new THREE.Plane(
          new THREE.Vector3(plane[0], plane[1], plane[2]),
          plane[3],
        ),
    );
    material.clipIntersection = item.intersection;
  }
  camera.matrixWorld.fromArray(pose.cameraWorld);
  camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
  camera.projectionMatrix.fromArray(pose.projection);
  camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  for (const item of pose.meshes) {
    const mesh = meshes.get(item.uuid);
    if (!mesh) continue;
    mesh.matrix.fromArray(item.matrix);
    mesh.visible = item.visible;
  }
  renderer.render(scene, camera);
}

self.onmessage = (event: MessageEvent) => {
  const message = event.data;
  try {
    if (message.type === "init") {
      renderer = new THREE.WebGLRenderer({
        canvas: message.canvas,
        alpha: true,
        antialias: true,
      });
      renderer.setPixelRatio(message.pixelRatio);
      renderer.setSize(message.width, message.height, false);
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.setClearColor(0, 0);
      rebuild(message.scene);
      const start = performance.now();
      render(message.pose);
      self.postMessage({
        type: "ready",
        frameMs: performance.now() - start,
        info: {
          geometries: renderer.info.memory.geometries,
          drawCalls: renderer.info.render.calls,
          triangles: renderer.info.render.triangles,
        },
      });
    } else if (message.type === "render") {
      if (message.scene) rebuild(message.scene);
      render(message.pose);
      self.postMessage({ type: "frame" });
    } else if (message.type === "resize") {
      renderer.setSize(message.width, message.height, false);
    }
  } catch (error) {
    self.postMessage({ type: "error", error: String(error) });
  }
};
