import type { Camera, Scene, WebGLRenderer } from "three";

export type SceneState = { camera: Camera; scene: Scene; gl: WebGLRenderer };
export type VectorTuple = [number, number, number];
export type ScreenRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};
export type ModelKind = "zip" | "pvd" | "cup";
export type Dispose = () => void;
