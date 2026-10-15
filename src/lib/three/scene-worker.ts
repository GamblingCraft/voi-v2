import * as THREE from "three";
import { disposePackagingTextureUploads } from "./packaging/textures";
import type {
  PosePacket,
  ScenePacket,
  TexturePacket,
} from "./scene-worker-protocol";

function sceneMeshes(scene: THREE.Scene) {
  const meshes: THREE.Mesh[] = [];
  scene.traverse((node) => {
    if ((node as THREE.Mesh).isMesh) meshes.push(node as THREE.Mesh);
  });
  return meshes;
}

function texturePacket(texture: THREE.Texture): TexturePacket {
  const image = texture.image;
  const compressed =
    (texture as THREE.CompressedTexture).isCompressedTexture === true;
  let data: TexturePacket["data"];
  if (!compressed) {
    if (image.data) data = image.data.slice();
    else {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d")!;
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      ).data;
      data = new Uint8Array(pixels.length);
      const row = canvas.width * 4;
      for (let y = 0; y < canvas.height; y++) {
        const source = texture.flipY ? canvas.height - y - 1 : y;
        data.set(pixels.subarray(source * row, (source + 1) * row), y * row);
      }
    }
  }
  const properties = texture.toJSON({
    textures: {},
    images: { [texture.source.uuid]: { uuid: texture.source.uuid, url: "" } },
  });
  return {
    uuid: texture.uuid,
    properties: properties as TexturePacket["properties"],
    width: image.width,
    height: image.height,
    compressed,
    data,
    mipmaps: compressed
      ? texture.mipmaps.map((mip) => ({
          width: mip.width,
          height: mip.height,
          data: new Uint8Array(
            mip.data.buffer,
            mip.data.byteOffset,
            mip.data.byteLength,
          ).slice(),
        }))
      : undefined,
    matrix: texture.matrix.toArray(),
    matrixAutoUpdate: texture.matrixAutoUpdate,
  };
}

export function encodeScene(scene: THREE.Scene): ScenePacket {
  const meshes = sceneMeshes(scene);
  const materials = new Map<string, THREE.Material>();
  const textures = new Map<string, THREE.Texture>();
  const geometries = new Map<string, THREE.BufferGeometry>();
  for (const mesh of meshes) {
    geometries.set(mesh.geometry.uuid, mesh.geometry);
    for (const material of Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material])
      materials.set(material.uuid, material);
  }
  for (const material of materials.values())
    for (const value of Object.values(material))
      if (
        value &&
        typeof value === "object" &&
        (value as THREE.Texture).isTexture
      )
        textures.set((value as THREE.Texture).uuid, value as THREE.Texture);
  if (scene.environment)
    textures.set(scene.environment.uuid, scene.environment);
  const meta = {
    textures: Object.fromEntries(
      [...textures.keys()].map((uuid) => [uuid, { uuid }]),
    ),
    images: {},
  };
  return {
    geometries: [...geometries.values()].map((geometry) => {
      // Primitive subclasses serialize parameters; the worker needs the exact
      // authored buffers, including UV edits, groups and sculpted folds.
      const buffer = new THREE.BufferGeometry();
      buffer.attributes = geometry.attributes;
      buffer.index = geometry.index;
      buffer.groups = geometry.groups;
      buffer.morphAttributes = geometry.morphAttributes;
      return { ...buffer.toJSON(), uuid: geometry.uuid };
    }),
    materials: [...materials.values()].map((material) => material.toJSON(meta)),
    textures: [...textures.values()].map(texturePacket),
    environment: scene.environment?.uuid,
    meshes: meshes.map((mesh) => {
      const instanced = mesh as THREE.InstancedMesh;
      return {
        uuid: mesh.uuid,
        name: mesh.name,
        geometry: mesh.geometry.uuid,
        materials: (Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material]
        ).map((material) => material.uuid),
        materialArray: Array.isArray(mesh.material),
        renderOrder: mesh.renderOrder,
        instanceCount: instanced.isInstancedMesh ? instanced.count : undefined,
        instanceMatrix: instanced.isInstancedMesh
          ? new Float32Array(instanced.instanceMatrix.array)
          : undefined,
        instanceColor:
          instanced.isInstancedMesh && instanced.instanceColor
            ? new Float32Array(instanced.instanceColor.array)
            : undefined,
      };
    }),
  };
}

export function pose(
  scene: THREE.Scene,
  camera: THREE.Camera,
  renderer: THREE.WebGLRenderer,
): PosePacket {
  scene.updateMatrixWorld();
  camera.updateMatrixWorld();
  const clipping = new Map<string, THREE.Material>();
  for (const mesh of sceneMeshes(scene))
    for (const material of Array.isArray(mesh.material)
      ? mesh.material
      : [mesh.material])
      clipping.set(material.uuid, material);
  return {
    localClipping: renderer.localClippingEnabled,
    clipping: [...clipping.values()].map((material) => ({
      uuid: material.uuid,
      intersection: material.clipIntersection,
      planes: (material.clippingPlanes ?? []).map((plane: THREE.Plane) => [
        ...plane.normal.toArray(),
        plane.constant,
      ]),
    })),
    cameraWorld: camera.matrixWorld.toArray(),
    projection: camera.projectionMatrix.toArray(),
    meshes: sceneMeshes(scene).map((mesh) => {
      let visible = true;
      for (
        let ancestor: THREE.Object3D | null = mesh;
        ancestor;
        ancestor = ancestor.parent
      )
        visible &&= ancestor.visible;
      return { uuid: mesh.uuid, matrix: mesh.matrixWorld.toArray(), visible };
    }),
  };
}

function signature(scene: THREE.Scene) {
  return sceneMeshes(scene)
    .map((mesh) =>
      [
        mesh.uuid,
        mesh.geometry.uuid,
        ...(Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map(
          (m) => m.uuid,
        ),
      ].join(":"),
    )
    .join("|");
}

export async function prepareSceneWorker(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  cancelled: () => boolean,
) {
  if (
    typeof Worker === "undefined" ||
    typeof OffscreenCanvas === "undefined" ||
    !HTMLCanvasElement.prototype.transferControlToOffscreen
  )
    return;
  const started = performance.now();
  const originalCanvas = renderer.domElement;
  const canvas = document.createElement("canvas");
  canvas.style.cssText = originalCanvas.style.cssText;
  const size = renderer.getSize(new THREE.Vector2());
  let worker: Worker;
  try {
    worker = new Worker(new URL("./scene-render.worker.ts", import.meta.url), {
      type: "module",
    });
  } catch (error) {
    console.warn("scene-worker-fallback", error);
    return;
  }
  let preparationTimer: ReturnType<typeof setInterval> | undefined;
  let stopped = false,
    installed = false,
    busy = false,
    pending = false;
  let currentSignature = signature(scene);
  const originalRender = renderer.render.bind(renderer);
  const originalSize = renderer.setSize.bind(renderer);
  const restore = () => {
    if (stopped) return;
    stopped = true;
    clearInterval(preparationTimer);
    worker.terminate();
    if (installed) {
      renderer.render = originalRender;
      renderer.setSize = originalSize;
      renderer.domElement = originalCanvas;
      originalCanvas.style.cssText = canvas.style.cssText;
      originalSize(
        canvas.clientWidth || size.x,
        canvas.clientHeight || size.y,
        false,
      );
      canvas.replaceWith(originalCanvas);
    }
  };
  const flush = () => {
    if (stopped || busy || !pending) return;
    pending = false;
    busy = true;
    const nextSignature = signature(scene);
    worker.postMessage({
      type: "render",
      pose: pose(scene, camera, renderer),
      scene:
        nextSignature !== currentSignature ? encodeScene(scene) : undefined,
    });
    currentSignature = nextSignature;
  };
  try {
    const packet = encodeScene(scene);
    const serializationMs = performance.now() - started;
    const ready = await new Promise<
      | {
          frameMs: number;
          info: { geometries: number; drawCalls: number; triangles: number };
        }
      | undefined
    >((resolve, reject) => {
      preparationTimer = setInterval(() => {
        if (cancelled()) {
          restore();
          resolve(undefined);
        }
      }, 50);
      worker.onerror = (event) => {
        clearInterval(preparationTimer);
        reject(new Error(event.message));
      };
      worker.onmessage = (event) => {
        if (event.data.type === "ready") {
          clearInterval(preparationTimer);
          resolve(event.data);
        }
        if (event.data.type === "error") {
          clearInterval(preparationTimer);
          reject(new Error(event.data.error));
        }
      };
      const offscreen = canvas.transferControlToOffscreen();
      worker.postMessage(
        {
          type: "init",
          canvas: offscreen,
          width: size.x,
          height: size.y,
          pixelRatio: renderer.getPixelRatio(),
          scene: packet,
          pose: pose(scene, camera, renderer),
        },
        [offscreen],
      );
    });
    if (!ready || cancelled()) {
      restore();
      return;
    }
    renderer.domElement = canvas;
    originalCanvas.replaceWith(canvas);
    installed = true;
    originalSize(1, 1, false);
    disposePackagingTextureUploads();
    renderer.render = () => {
      pending = true;
      flush();
    };
    renderer.setSize = (width, height, updateStyle = true) => {
      originalSize(1, 1, false);
      if (updateStyle) {
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
      worker.postMessage({ type: "resize", width, height });
    };
    worker.onmessage = (event) => {
      if (event.data.type === "frame") {
        busy = false;
        flush();
      }
      if (event.data.type === "error") {
        console.warn("scene-worker-fallback", event.data.error);
        restore();
        originalRender(scene, camera);
      }
    };
    worker.onerror = (event) => {
      console.warn("scene-worker-fallback", event.message);
      restore();
      originalRender(scene, camera);
    };
    return {
      metrics: {
        worker: true,
        serializationMs,
        frameMs: ready.frameMs,
        readyMs: performance.now() - started,
      },
      info: ready.info,
      dispose: restore,
    };
  } catch (error) {
    restore();
    if (!cancelled()) console.warn("scene-worker-fallback", error);
    return;
  }
}
