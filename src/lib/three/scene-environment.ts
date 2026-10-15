import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import asset from "@/lib/three/data/scene-environment.json";

let preparedBytes: Promise<ArrayBuffer> | undefined;

export async function loadSceneEnvironment() {
  try {
    preparedBytes ??= fetch(asset.url).then(async (response) => {
      if (!response.ok) throw new Error(`Environment HTTP ${response.status}`);
      const bytes = await response.arrayBuffer();
      const header = new Uint8Array(bytes, 0, Math.min(2, bytes.byteLength));
      // Hosting may deliver gzip either as a file or with Content-Encoding.
      const decoded =
        header[0] === 0x1f && header[1] === 0x8b
          ? await new Response(
              new Blob([bytes])
                .stream()
                .pipeThrough(new DecompressionStream("gzip")),
            ).arrayBuffer()
          : bytes;
      if (decoded.byteLength !== asset.byteLength)
        throw new Error("Incomplete environment texture");
      return decoded;
    });
    const bytes = await preparedBytes;
    const texture = new THREE.DataTexture(
      new Uint16Array(bytes),
      asset.width,
      asset.height,
      THREE.RGBAFormat,
      THREE.HalfFloatType,
    );
    texture.mapping = THREE.CubeUVReflectionMapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    return texture;
  } catch (error) {
    preparedBytes = undefined;
    console.warn("prepared-environment-fallback", error);
    const texture = await new RGBELoader().loadAsync(asset.source);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    return texture;
  }
}
