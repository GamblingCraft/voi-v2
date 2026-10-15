import * as THREE from "three";
import { sceneAsset } from "@/lib/three/scene-assets";
import ktx2Assets from "@/lib/three/data/scene-ktx2.json";
const registry: Record<string, THREE.Texture> = {};
const originalRegistry: Record<string, THREE.Texture> = {};
let originalOnly = false;
export function selectOriginalPackagingTextures() {
  originalOnly = true;
}
const pending = new Map<string, Promise<THREE.Texture>>();
const loads: Promise<boolean>[] = [];
const loader = new THREE.TextureLoader();
const initialTextures = [
  "/media/product/textures/kraft-front.jpg",
  "/media/product/textures/kraft-back.jpg",
  "/media/product/textures/cup-crop.png",
  "/media/product/textures/pvd-2-alpha.png",
  "/media/product/textures/pvd-2-back-alpha.png",
];

// Preload complete GPU textures before constructing materials. Replacing an
// ordinary Texture with a CompressedTexture after rendering changes shader
// and upload assumptions; never swap types through a placeholder.
export async function preparePackagingTextures(
  renderer: THREE.WebGLRenderer,
  paths = initialTextures,
  onProgress?: (fraction: number) => void,
) {
  originalOnly = false;
  const missing = paths.filter((path) => !registry[path] && !pending.has(path));
  let completed = paths.length - missing.length;
  onProgress?.(completed / paths.length);
  const nativeCompression = [
    "WEBGL_compressed_texture_astc",
    "EXT_texture_compression_bptc",
    "WEBGL_compressed_texture_etc",
  ].some((name) => renderer.extensions.has(name));
  // Stable original mode permits repeatable visual and loading comparisons.
  const originalMode =
    new URLSearchParams(location.search).get("textures") === "original";
  if (missing.length && nativeCompression && !originalMode) {
    const { KTX2Loader } =
      await import("three/examples/jsm/loaders/KTX2Loader.js");
    const compressedLoader = new KTX2Loader()
      .setTranscoderPath("/media/product/media/optimized/basis-r151/")
      .setWorkerLimit(2)
      .detectSupport(renderer);
    try {
      await Promise.all(
        missing.map((path) => {
          // Another preparation may have started during the dynamic import.
          if (registry[path] || pending.has(path)) return pending.get(path);
          const asset = (
            ktx2Assets as Record<
              string,
              { url: string; width: number; height: number }
            >
          )[path];
          const load = (
            asset
              ? compressedLoader.loadAsync(asset.url)
              : Promise.reject(new Error("No KTX2 asset"))
          )
            .then((map) => {
              map.userData.artworkWidth = asset.width;
              map.userData.artworkHeight = asset.height;
              alignPackagingTextureUv(map);
              // r151's Basis worker reports padded block dimensions for each
              // mip. WebGL texStorage expects logical floor-divided sizes;
              // the buffer itself still contains the complete edge blocks.
              map.mipmaps = map.mipmaps.map((mip, level) => ({
                ...mip,
                width: Math.max(1, Math.floor(map.image.width / 2 ** level)),
                height: Math.max(1, Math.floor(map.image.height / 2 ** level)),
              }));
              map.anisotropy = Math.min(
                8,
                renderer.capabilities.getMaxAnisotropy(),
              );
              const gl = renderer.getContext();
              // Extension presence alone is insufficient on some drivers.
              // Validate the real upload before committing the cached map.
              for (
                let i = 0;
                renderer.domElement.isConnected &&
                i < 8 &&
                gl.getError() !== gl.NO_ERROR;
                i++
              ) {
                // Drain earlier initialization errors.
              }
              if (renderer.domElement.isConnected) renderer.initTexture(map);
              const uploadError = renderer.domElement.isConnected
                ? gl.getError()
                : gl.NO_ERROR;
              if (uploadError !== gl.NO_ERROR) {
                map.dispose();
                throw new Error(
                  `Compressed upload failed: ${path} (${uploadError})`,
                );
              }
              registry[path] = map;
              return map;
            })
            .catch((error) => {
              console.warn("ktx2-texture-fallback", path, error);
              // Unsupported device, corrupt response or worker failure: load
              // the unchanged WebP/JPEG instead, keeping the page usable.
              return loader
                .loadAsync(sceneAsset(path))
                .then((map) => {
                  map.encoding = THREE.sRGBEncoding;
                  map.anisotropy = Math.min(
                    8,
                    renderer.capabilities.getMaxAnisotropy(),
                  );
                  registry[path] = map;
                  return map;
                })
                .catch(() => texture(path));
            })
            .finally(() => onProgress?.(++completed / paths.length));
          pending.set(path, load);
          return load;
        }),
      );
    } finally {
      // Release WASM workers after upload preparation, including failures.
      compressedLoader.dispose();
    }
  } else {
    for (const path of missing) texture(path);
  }
  await Promise.all(paths.map((path) => pending.get(path)));
  await packagingTexturesReady();
  onProgress?.(1);
}

export function alignPackagingTextureUv(map: THREE.Texture) {
  const width = map.userData.artworkWidth as number | undefined;
  const height = map.userData.artworkHeight as number | undefined;
  if (!width || !height) return;
  map.updateMatrix();
  // Input was padded at right/bottom, then flipped vertically by Basis.
  // Apply the content rectangle AFTER the artwork's rotation/print bleed.
  const content = new THREE.Matrix3().set(
    width / map.image.width,
    0,
    0,
    0,
    height / map.image.height,
    (map.image.height - height) / map.image.height,
    0,
    0,
    1,
  );
  map.matrix.premultiply(content);
  map.matrixAutoUpdate = false;
}

export function packagingTextureStats() {
  return Object.entries(registry).map(([source, map]) => {
    const compressed = map as THREE.CompressedTexture;
    const isCompressed = !!compressed.isCompressedTexture;
    const width = map.image?.width ?? 0,
      height = map.image?.height ?? 0;
    // Compressed bytes are actual upload buffers. RGBA is an estimate with
    // the generated mip chain, not a driver VRAM measurement.
    const uploadBytes = isCompressed
      ? compressed.mipmaps.reduce((sum, mip) => sum + mip.data.byteLength, 0)
      : Math.round(width * height * 4 * (map.generateMipmaps ? 4 / 3 : 1));
    return {
      source,
      compressed: isCompressed,
      width,
      height,
      uploadBytes,
      format: map.format,
      mipLevels: isCompressed ? compressed.mipmaps.length : null,
    };
  });
}
export function disposePackagingTextureUploads() {
  for (const map of [...Object.values(registry), ...Object.values(detailMaps)])
    map.dispose();
}
export function texture(path: string, color = true) {
  const cache = originalOnly ? originalRegistry : registry;
  if (!cache[path]) {
    let settle: (loaded: boolean) => void = () => {};
    loads.push(
      new Promise<boolean>((resolve) => {
        settle = resolve;
      }),
    );
    const t = loader.load(
      sceneAsset(path),
      () => settle(true),
      undefined,
      () => {
        console.error("packaging-texture-load", path);
        settle(false);
      },
    );
    t.encoding = color ? THREE.sRGBEncoding : THREE.LinearEncoding;
    t.anisotropy = 8;
    cache[path] = t;
  }
  return cache[path];
}
export function packagingTexturesReady() {
  return Promise.all(loads);
}
const detailMaps: Record<string, THREE.DataTexture> = {};
export function surfaceMap(kind: "film" | "ice" | "seal") {
  if (detailMaps[kind]) return detailMaps[kind];
  const n = 256,
    data = new Uint8Array(n * n * 4);
  let seed = 917;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
    return (seed >>> 0) / 4294967296;
  };
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const noise = (random() - 0.5) * 18;
      const fold =
        kind === "seal"
          ? Math.sin(x * 2.1) * 50
          : Math.sin(x * 0.19 + y * 0.07) * 8 +
            Math.sin(y * 0.8 + x * 0.17) * 4;
      const value = Math.max(0, Math.min(255, 128 + noise + fold));
      const i = (y * n + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = value;
      data[i + 3] = 255;
    }
  if (kind === "ice")
    for (let line = 0; line < 12; line++) {
      let x = random() * n,
        y = random() * n,
        angle = random() * Math.PI * 2;
      for (let step = 0; step < 25 + random() * 45; step++) {
        x += Math.cos(angle) * 1.8;
        y += Math.sin(angle) * 1.8;
        angle += (random() - 0.5) * 0.45;
        const ix = Math.floor(x),
          iy = Math.floor(y);
        if (ix > 0 && ix < n - 1 && iy > 0 && iy < n - 1) {
          const i = (iy * n + ix) * 4;
          data[i] = data[i + 1] = data[i + 2] = 235;
        }
      }
    }
  const t = new THREE.DataTexture(data, n, n, THREE.RGBAFormat);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.needsUpdate = true;
  detailMaps[kind] = t;
  return t;
}
