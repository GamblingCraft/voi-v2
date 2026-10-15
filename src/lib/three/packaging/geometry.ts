import * as THREE from "three";
import type { ModelKind as ProductKind } from "@/lib/three/types";
import { at } from "./build-config";
import { zipPanelPoint } from "./zip-profile";
export function mesh(
  name: string,
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  parent: THREE.Group,
) {
  const m = new THREE.Mesh(geometry, material);
  m.name = name;
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}
export function pouchSurface(
  w: number,
  h: number,
  depth: number,
  side: number,
  kind: ProductKind,
) {
  const nx = 48,
    ny = 64,
    positions: number[] = [],
    uvs: number[] = [],
    indices: number[] = [];
  for (let y = 0; y <= ny; y++)
    for (let x = 0; x <= nx; x++) {
      const u = x / nx,
        v = y / ny,
        a = u * 2 - 1,
        b = v * 2 - 1;
      if (kind === "zip") {
        const point = zipPanelPoint(
          w,
          h,
          depth,
          u,
          v,
          side,
          at("form-refinement"),
        );
        positions.push(point.x, point.y, point.z);
        uvs.push(u, v);
        continue;
      }
      const waist =
        kind === "pvd"
          ? 1 - 0.1 * Math.sin(Math.PI * v)
          : 1 - 0.025 * Math.sin(Math.PI * v);
      const corner = 1 - 0.045 * Math.pow(Math.abs(b), 18);
      const pin =
        Math.pow(Math.max(0, Math.sin(Math.PI * u)), 0.55) *
        Math.pow(Math.max(0, Math.sin(Math.PI * v)), 0.4);
      let z = 0.008 + depth * 0.5 * pin;
      if (kind !== "pvd" && v > 0.87)
        z = 0.008 + depth * 0.5 * pin * Math.max(0.08, (1 - v) / 0.13);
      if (at("form-refinement")) {
        const edge = Math.exp(-Math.min(u, 1 - u) * 13),
          shoulder = Math.exp(-Math.abs(v - 0.86) * 25);
        const wrinkles =
          (Math.sin(v * 91 + u * 17) * 0.018 +
            Math.sin(v * 43 - u * 35) * 0.012) *
          edge;
        const diagonal =
          Math.sin(u * 42 + v * 31) *
          0.009 *
          Math.sin(Math.PI * u) *
          Math.sin(Math.PI * v);
        z +=
          wrinkles * Math.sin(Math.PI * v) +
          diagonal +
          shoulder * Math.sin(u * 56) * 0.008;
      }
      positions.push(a * w * 0.5 * waist * corner, b * h * 0.5, side * z);
      uvs.push(u, v);
    }
  for (let y = 0; y < ny; y++)
    for (let x = 0; x < nx; x++) {
      const a = y * (nx + 1) + x,
        b = a + 1,
        c = a + nx + 1,
        d = c + 1;
      if (side > 0) indices.push(a, b, d, a, d, c);
      else indices.push(a, d, b, a, c, d);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}
export function bottomGusset(w: number, h: number, depth: number) {
  const positions: number[] = [],
    uvs: number[] = [],
    indices: number[] = [],
    nx = 48,
    nz = 24;
  for (let z = 0; z <= nz; z++)
    for (let x = 0; x <= nx; x++) {
      const u = x / nx,
        v = z / nz,
        b = v * 2 - 1,
        arc = Math.sin(Math.PI * u);
      const rim = zipPanelPoint(w, h, depth, u, 0, 1);
      positions.push(
        rim.x,
        rim.y + 0.16 * arc * (1 - Math.abs(b)) ** 1.4,
        b * rim.z,
      );
      uvs.push(u, v);
    }
  for (let z = 0; z < nz; z++)
    for (let x = 0; x < nx; x++) {
      const a = z * (nx + 1) + x,
        b = a + 1,
        c = a + nx + 1,
        d = c + 1;
      indices.push(a, b, d, a, d, c);
    }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}
export function iceFill(
  parent: THREE.Group,
  kind: ProductKind,
  material: THREE.Material,
) {
  let seed = 42;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
    return (seed >>> 0) / 4294967296;
  };
  const geo =
    kind === "cup" || kind === "pvd"
      ? new THREE.BoxGeometry(0.38, 0.38, 0.38)
      : new THREE.CylinderGeometry(0.22, 0.22, 0.38, 12);
  geo.computeVertexNormals();
  const points: THREE.Vector3[] = [];
  const zScales: number[] = [];
  if (kind === "cup") {
    for (let layer = 0; layer < 8; layer++) {
      const y = -0.98 + layer * 0.285,
        innerRadius = 0.585 + ((y - 0.205 + 1.23) / 2.51) * 0.29 - 0.015;
      for (let ix = -2; ix <= 2; ix++)
        for (let iz = -2; iz <= 2; iz++) {
          const x = ix * 0.31 + (layer % 2 ? 0.06 : 0),
            z = iz * 0.31;
          if (
            Math.hypot(Math.abs(x) + 0.205, Math.abs(z) + 0.205) <= innerRadius
          )
            points.push(new THREE.Vector3(x, y, z));
        }
    }
  } else if (kind === "zip") {
    for (let i = 0; i < 5; i++) {
      points.push(new THREE.Vector3((i - 2) * 0.32, -1.38, 0));
      zScales.push(0.65);
    }
  } else {
    for (let iy = 0; iy < 9; iy++)
      for (let ix = 0; ix < 6; ix++) {
        const x = (ix - 2.5) * 0.34,
          y = (iy - 4) * 0.31;
        // Evaluate the shell at the furthest cube corner, not only at its centre.
        const u = (Math.abs(x) + 0.215) / 2.5 + 0.5,
          v = (Math.abs(y) + 0.215) / 3.3 + 0.5;
        const thickness =
          0.6 *
            Math.pow(Math.sin(Math.PI * u), 0.55) *
            Math.pow(Math.sin(Math.PI * v), 0.4) -
          0.015;
        if (thickness < 0.195) continue;
        const allowance = thickness - 0.19 - 0.018;
        for (const z of allowance > 0.18
          ? [-allowance, 0, allowance]
          : allowance > 0.09
            ? [-allowance, allowance]
            : [0]) {
          points.push(new THREE.Vector3(x, y, z));
          zScales.push(0.94);
        }
      }
  }
  const ice = new THREE.InstancedMesh(geo, material, points.length);
  ice.name = "ice-pieces";
  ice.castShadow = true;
  const dummy = new THREE.Object3D();
  const corner = new THREE.Vector3();
  const fits = () => {
    for (const x of [-0.19, 0.19])
      for (const y of [-0.19, 0.19])
        for (const z of [-0.19, 0.19]) {
          corner.set(x, y, z).applyMatrix4(dummy.matrix);
          if (kind === "cup") {
            const r = 0.585 + ((corner.y + 1.23) / 2.51) * 0.29 - 0.012;
            if (
              corner.y < -1.23 ||
              corner.y > 1.265 ||
              Math.hypot(corner.x, corner.z) > r
            )
              return false;
          } else if (kind === "pvd") {
            const u = corner.x / 2.5 + 0.5,
              v = corner.y / 3.3 + 0.5;
            if (u <= 0 || u >= 1 || v <= 0 || v >= 1) return false;
            const d =
              0.008 +
              0.6 *
                Math.pow(Math.sin(Math.PI * u), 0.55) *
                Math.pow(Math.sin(Math.PI * v), 0.4) -
              0.024;
            const w =
              1.25 *
                (1 - 0.1 * Math.sin(Math.PI * v)) *
                (1 - 0.045 * Math.pow(Math.abs(v * 2 - 1), 18)) -
              0.01;
            if (Math.abs(corner.x) > w || Math.abs(corner.z) > d) return false;
          }
        }
    return true;
  };
  points.forEach((p, i) => {
    const scale = 0.94;
    dummy.scale.setScalar(scale);
    let accepted = false;
    for (let attempt = 0; attempt < 60; attempt++) {
      dummy.position
        .copy(p)
        .add(
          new THREE.Vector3(
            (random() - 0.5) * 0.15,
            (random() - 0.5) * 0.15,
            (random() - 0.5) * 0.12,
          ),
        );
      dummy.rotation.set(
        (random() - 0.5) * Math.PI,
        (random() - 0.5) * Math.PI,
        (random() - 0.5) * Math.PI,
      );
      dummy.updateMatrix();
      if (fits()) {
        accepted = true;
        break;
      }
    }
    if (!accepted) {
      dummy.position.copy(p);
      dummy.rotation.set(0, 0, (random() - 0.5) * 0.08);
      dummy.updateMatrix();
    }
    ice.setMatrixAt(i, dummy.matrix);
  });
  ice.userData.fill = "dense-chaotic";
  ice.userData.iceShape = kind === "pvd" || kind === "cup" ? "cube" : "barrel";
  ice.userData.pieceCount = points.length;
  parent.add(ice);
}
