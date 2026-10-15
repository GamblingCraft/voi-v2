import * as THREE from "three";
import type { ModelKind as ProductKind } from "@/lib/three/types";
import { at } from "./build-config";
import { mesh, pouchSurface, bottomGusset, iceFill } from "./geometry";
import { applyMaterials } from "./materials";
import { zipPanelPoint } from "./zip-profile";
export { passes, buildPass, setBuildPass } from "./build-config";
export { packagingBounds } from "./bounds";
export type { ModelKind as ProductKind } from "@/lib/three/types";
export function createPackagingModel(kind: ProductKind, kg = 2): THREE.Group {
  const root = new THREE.Group();
  root.name = `voi-${kind}`;
  const neutral = new THREE.MeshStandardMaterial({
    color: "#20262b",
    roughness: 0.65,
  });
  if (kind === "cup") {
    const profile = [
      new THREE.Vector2(0.59, -1.25),
      new THREE.Vector2(0.61, -1.3),
      new THREE.Vector2(0.68, -1.2),
      new THREE.Vector2(0.88, 1.25),
      new THREE.Vector2(0.9, 1.28),
    ];
    if (at("structural-pass"))
      profile.push(
        new THREE.Vector2(0.875, 1.28),
        new THREE.Vector2(0.585, -1.23),
        new THREE.Vector2(0, -1.23),
      );
    mesh("cup-body", new THREE.LatheGeometry(profile, 64), neutral, root);
    const lid = mesh(
      "cup-lid",
      new THREE.CylinderGeometry(0.91, 0.91, 0.025, 64),
      neutral,
      root,
    );
    lid.position.y = 1.29;
    if (at("structural-pass")) {
      const rim = mesh(
        "cup-rim",
        new THREE.TorusGeometry(0.89, 0.025, 8, 64),
        neutral,
        root,
      );
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 1.265;
      // The separate tab produced an unprinted coloured artifact. The supplied
      // lid graphic now sits on a clean uninterrupted circular cap.
      iceFill(root, "cup", neutral);
    }
  } else {
    // Keep the existing artwork proportions; the ZIP opens through a bottom gusset.
    const w = kind === "zip" ? 2.05 : 2.5,
      h = kind === "zip" ? 3.2 : 3.3;
    const shape = new THREE.Shape();
    const r = 0.09;
    shape.moveTo(-w / 2 + r, -h / 2);
    shape.lineTo(w / 2 - r, -h / 2);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    shape.lineTo(w / 2, h / 2 - r);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    shape.lineTo(-w / 2 + r, h / 2);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    shape.lineTo(-w / 2, -h / 2 + r);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    if (at("structural-pass")) {
      const body = new THREE.Group();
      body.name = kind === "zip" ? "zip-body" : "pvd-body";
      root.add(body);
      const group = kind === "zip" ? new THREE.Group() : body;
      if (kind === "zip") {
        group.name = "zip-folds";
        body.add(group);
      }
      const filledDepth = kind === "pvd" ? 1.2 : 0.9;
      mesh(
        "front-panel",
        pouchSurface(w, h, filledDepth, 1, kind),
        neutral,
        group,
      );
      mesh(
        "back-panel",
        pouchSurface(w, h, filledDepth, -1, kind),
        neutral,
        group,
      );
      // Join the perimeter with real geometry rather than double-sided planes.
      const front = (group.children[0] as THREE.Mesh).geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      const back = (group.children[1] as THREE.Mesh).geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      const edgePositions: number[] = [],
        edgeIndices: number[] = [];
      const perimeter = [
        ...Array.from({ length: 49 }, (_, i) => i),
        ...Array.from({ length: 64 }, (_, i) => (i + 1) * 49 + 48),
        ...Array.from({ length: 49 }, (_, i) => 64 * 49 + 48 - i),
        ...Array.from({ length: 64 }, (_, i) => (63 - i) * 49),
      ];
      for (const id of perimeter)
        for (const p of [front, back])
          edgePositions.push(p.getX(id), p.getY(id), p.getZ(id));
      for (let i = 0; i < perimeter.length - 1; i++) {
        // ZIP's bottom is closed by the inset gusset, never a second flat cap.
        if (kind === "zip" && i < 48) continue;
        const a = i * 2;
        edgeIndices.push(a, a + 1, a + 3, a, a + 3, a + 2);
      }
      const edges = new THREE.BufferGeometry();
      edges.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(edgePositions, 3),
      );
      edges.setIndex(edgeIndices);
      edges.computeVertexNormals();
      mesh("welded-perimeter", edges, neutral, group);
      for (const y of kind === "pvd"
        ? [h / 2 - 0.06, -h / 2 + 0.06]
        : [h / 2 - 0.06]) {
        const seal = mesh(
          kind === "zip"
            ? "zip-seal"
            : y > 0
              ? "pvd-top-seal"
              : "pvd-bottom-seal",
          new THREE.BoxGeometry(w * 0.95, 0.12, 0.021),
          neutral,
          root,
        );
        seal.position.y = y;
        seal.userData.explodeWithParent = true;
      }
      if (kind !== "pvd")
        mesh("bottom-gusset", bottomGusset(w, h, filledDepth), neutral, root);
      if (kind !== "pvd") {
        for (const y of [h / 2 - 0.35, h / 2 - 0.385]) {
          const points = Array.from({ length: 49 }, (_, i) => {
            const u = 0.025 + (i / 48) * 0.95;
            const point = zipPanelPoint(
              w,
              h,
              filledDepth,
              u,
              (y + h / 2) / h,
              1,
              at("form-refinement"),
            );
            point.z += 0.004;
            return point;
          });
          const zipper = mesh(
            "zip-closure",
            new THREE.TubeGeometry(
              new THREE.CatmullRomCurve3(points),
              48,
              0.008,
              6,
              false,
            ),
            neutral,
            root,
          );
          zipper.userData.explodeWithParent = true;
        }
        // Closed ZIP/kraft artwork obscures its contents; no inner ice mesh is needed.
      } else iceFill(root, "pvd", neutral);
    } else {
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: kind === "zip" ? 0.6 : 0.8,
        bevelEnabled: true,
        bevelSize: 0.06,
        bevelThickness: 0.06,
        bevelSegments: 3,
        steps: 1,
      });
      geo.translate(0, 0, -(kind === "zip" ? 0.3 : 0.4));
      mesh(kind === "zip" ? "zip-body" : "pvd-body", geo, neutral, root);
    }
  }
  if (at("material-pass")) applyMaterials(root, kind, kg);
  root.userData.kind = kind;
  root.userData.kg = kg;
  // Scale the complete package and contents together, preserving containment.
  root.scale.setScalar(kind === "pvd" ? 1.3 : 1);
  const nodes: Record<string, THREE.Object3D> = {},
    meshes: THREE.Mesh[] = [];
  root.traverse((node) => {
    if (node.name) nodes[node.name] = node;
    if ((node as THREE.Mesh).isMesh) {
      const m = node as THREE.Mesh;
      meshes.push(m);
      m.userData.selectable = true;
      m.userData.restPosition = m.position.clone();
      m.userData.explodeOffset =
        m.name === "front-panel" || m.name === "pvd-front-print"
          ? [0, 0, 0.6]
          : m.name === "back-panel" || m.name === "pvd-back-print"
            ? [0, 0, -0.6]
            : m.name === "bottom-gusset"
              ? [0, -0.6, 0]
              : m.name === "cup-lid"
                ? [0, 1, 0]
                : m.name === "cup-rim"
                  ? [0, 0.6, 0]
                  : m.name.includes("seal")
                    ? [0, m.position.y > 0 ? 0.4 : -0.4, 0]
                    : [0, 0, 0];
    }
  });
  Object.defineProperty(root.userData, "sculptRuntime", {
    enumerable: false,
    value: {
      nodes,
      meshes,
      sockets: {
        rim: [0, 1.28, 0],
        zipClosure: [0, 1.25, 0],
        base: [0, kind === "cup" ? -1.23 : -1.6, 0],
      },
      colliders: [
        {
          type: kind === "cup" ? "tapered-cylinder" : "pouch",
          size:
            kind === "cup"
              ? [1.8, 2.6, 1.8]
              : [
                  kind === "zip" ? 2.05 : 2.5,
                  kind === "zip" ? 3.2 : 3.3,
                  kind === "zip" ? 0.92 : 1.2,
                ],
        },
      ],
      destructionGroups: [],
      actions: { select: true, explode: true },
      pivot: "package-centre",
    },
  });
  return root;
}
