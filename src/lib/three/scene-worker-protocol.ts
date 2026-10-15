import type * as THREE from "three";

export type TexturePacket = {
  uuid: string;
  properties: Record<string, unknown> & {
    wrap: THREE.Wrapping[];
    offset: number[];
    repeat: number[];
    center: number[];
    rotation: number;
  };
  width: number;
  height: number;
  compressed: boolean;
  data?: Uint8Array | Uint16Array | Float32Array;
  mipmaps?: { width: number; height: number; data: Uint8Array }[];
  matrix: number[];
  matrixAutoUpdate: boolean;
};
export type PosePacket = {
  cameraWorld: number[];
  projection: number[];
  meshes: { uuid: string; matrix: number[]; visible: boolean }[];
  clipping: { uuid: string; planes: number[][]; intersection: boolean }[];
  localClipping: boolean;
};
export type ScenePacket = {
  geometries: (ReturnType<THREE.BufferGeometry["toJSON"]> & { uuid: string })[];
  materials: ReturnType<THREE.Material["toJSON"]>[];
  textures: TexturePacket[];
  environment?: string;
  meshes: {
    uuid: string;
    name: string;
    geometry: string;
    materials: string[];
    materialArray: boolean;
    renderOrder: number;
    instanceCount?: number;
    instanceMatrix?: Float32Array;
    instanceColor?: Float32Array;
  }[];
};
