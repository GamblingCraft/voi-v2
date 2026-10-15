import * as THREE from "three";
import type { ModelKind as ProductKind } from "@/lib/three/types";
import { texture, surfaceMap, alignPackagingTextureUv } from "./textures";
import { mesh } from "./geometry";
import { at } from "./build-config";
export function applyMaterials(
  root: THREE.Group,
  kind: ProductKind,
  kg: number,
) {
  const film = new THREE.MeshPhysicalMaterial({
    color: "#c2d1df",
    roughness: 0.13,
    metalness: 0,
    transparent: true,
    opacity: 0.27,
    depthWrite: false,
    side: THREE.FrontSide,
    ior: 1.47,
    clearcoat: 0.7,
    clearcoatRoughness: 0.12,
  });
  // Smooth glossy LDPE film: broad reflections follow the sculpted folds.
  // Keep the cup's finish independent from the larger ice bag.
  if (kind === "pvd") {
    film.color.set("#bec9d2");
    film.roughness = 0.035;
    film.opacity = 0.46;
    film.clearcoat = 1;
    film.clearcoatRoughness = 0.035;
    film.envMapIntensity = 2.4;
    film.specularIntensity = 2;
  }
  if (kind === "cup") {
    film.color.set("#c3d0dc");
    film.roughness = 0.035;
    film.opacity = 0.32;
    film.clearcoat = 1;
    film.clearcoatRoughness = 0.04;
    film.envMapIntensity = 1.7;
    film.specularIntensity = 1.5;
  }
  const matteBack = new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    roughness: 0.9,
    metalness: 0,
    transparent: false,
    opacity: 1,
    transmission: 0,
    depthWrite: true,
    side: THREE.DoubleSide,
    clearcoat: 0,
    envMapIntensity: 0.35,
    specularIntensity: 0.2,
  });
  const black = new THREE.MeshPhysicalMaterial({
    color: "#10151b",
    roughness: 0.35,
    metalness: 0,
    clearcoat: 0.22,
    clearcoatRoughness: 0.3,
    envMapIntensity: 0.5,
    specularIntensity: 0.55,
  });
  const ice = new THREE.MeshPhysicalMaterial({
    color: "#d2e6ef",
    roughness: 0.04,
    metalness: 0,
    transmission: 0.7,
    thickness: 0.34,
    ior: 1.31,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    envMapIntensity: 0.8,
    attenuationColor: new THREE.Color("#a7d1e5"),
    attenuationDistance: 1.2,
  });
  const lidInk = new THREE.MeshPhysicalMaterial({
    map: texture("/media/product/textures/cup-crop.png"),
    roughness: 0.18,
    metalness: 0,
    clearcoat: 0.65,
    clearcoatRoughness: 0.09,
    envMapIntensity: 0.85,
  });
  // Add print bleed: the source includes white outside its circular artwork.
  // Sample the inner 90% so that white cannot reach the curved cap's edge.
  lidInk.map!.center.set(0.5, 0.5);
  lidInk.map!.repeat.set(0.9, 0.9);
  lidInk.map!.rotation = Math.PI / 2;
  alignPackagingTextureUv(lidInk.map!);
  if (at("surface-pass")) {
    if (kind !== "pvd" && kind !== "cup") {
      film.bumpMap = surfaceMap("film");
      film.bumpScale = 0.008;
      film.roughnessMap = surfaceMap("film");
    }
    black.bumpMap = surfaceMap("seal");
    black.bumpScale = 0.001;
    black.roughnessMap = surfaceMap("film");
    // Smooth ice per user: no grain, height, bump, normal or roughness texture.
  }
  root.traverse((node) => {
    if (!(node as THREE.Mesh).isMesh) return;
    const m = node as THREE.Mesh;
    if (m.name === "ice-pieces") {
      m.material = ice;
      return;
    }
    if (kind === "cup") {
      if (m.name === "cup-lid") {
        m.material = [black, lidInk, black];
        // Cylinder cap uses planar UVs, preserving the exact circular artwork.
      } else m.material = m.name === "cup-pull-tab" ? black : film;
    } else if (kind === "pvd")
      m.material = m.name === "back-panel" ? matteBack : film;
    else if (m.name === "front-panel" || m.name === "back-panel") {
      const front = m.name === "front-panel";
      const map = texture(
        `/media/product/textures/kraft-${front ? "front" : "back"}.jpg`,
      );
      if (!front) {
        const uv = m.geometry.getAttribute("uv") as THREE.BufferAttribute;
        for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i));
        uv.needsUpdate = true;
      }
      // A small artwork-weighted lift keeps print readable under the site's darker
      // studio environment without raising highlights or washing out black ink.
      m.material = new THREE.MeshPhysicalMaterial({
        map,
        color: "#fff",
        roughness: 0.38,
        metalness: 0,
        clearcoat: 0.22,
        clearcoatRoughness: 0.3,
        envMapIntensity: 0.75,
        specularIntensity: 0.65,
        emissiveMap: map,
        emissive: "#fff",
        emissiveIntensity: 0.15,
      });
      if (at("surface-pass")) {
        const material = m.material as THREE.MeshPhysicalMaterial;
        material.bumpMap = surfaceMap("film");
        material.bumpScale = 0.0015;
        material.roughnessMap = surfaceMap("film");
      }
    } else m.material = m.name === "bottom-gusset" ? film : black;
  });
  if (kind === "pvd") {
    const printedFilm = (url: string) => {
      const map = texture(url);
      return new THREE.MeshPhysicalMaterial({
        map,
        roughness: 0.09,
        clearcoat: 0.55,
        clearcoatRoughness: 0.055,
        envMapIntensity: 0.8,
        transparent: true,
        alphaTest: 0.1,
        depthWrite: false,
        side: THREE.FrontSide,
        emissiveMap: map,
        emissive: "#fff",
        emissiveIntensity: 0.25,
      });
    };
    const front = root.getObjectByName("front-panel") as THREE.Mesh;
    const print = mesh(
      "pvd-front-print",
      front.geometry.clone(),
      printedFilm(`/media/product/textures/pvd-${kg}-alpha.png`),
      root,
    );
    print.position.z = 0.007;
    print.renderOrder = 3;
    const back = root.getObjectByName("back-panel") as THREE.Mesh;
    const backGeo = back.geometry.clone();
    const uv = backGeo.getAttribute("uv") as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i));
    const backInk = printedFilm(
      `/media/product/textures/pvd-${kg}-back-alpha.png`,
    );
    backInk.roughness = 0.9;
    backInk.clearcoat = 0;
    backInk.envMapIntensity = 0.35;
    backInk.emissiveIntensity = 0;
    const backPrint = mesh("pvd-back-print", backGeo, backInk, root);
    backPrint.position.z = -0.007;
    backPrint.renderOrder = 3;
  }
}
