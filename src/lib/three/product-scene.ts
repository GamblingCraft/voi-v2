import * as THREE from "three";
import { loadSceneEnvironment } from "./scene-environment";
import { createPackagingModel, setBuildPass } from "./packaging";
import { setupProductChoreography } from "./product-choreography";
import { setupCloudTransition } from "./cloud-transition";
import {
  preparePackagingTextures,
  packagingTextureStats,
  disposePackagingTextureUploads,
} from "./packaging/textures";
import { disposeScene } from "./dispose-scene";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import type { ModelKind } from "@/lib/three/types";
import { isMobileScene } from "@/lib/motion/scene-layout";
import { createSceneLoadingTracker } from "./scene-loading";
import {
  prepareFirstFrame,
  yieldScenePreparation,
} from "./prepare-first-frame";

export function createProductScene(
  progress?: ReturnType<typeof createSceneLoadingTracker>,
  skipIntro = false,
) {
  const startedAt = performance.now();
  const mobile = isMobileScene();
  const target = document.querySelector<HTMLElement>(
    mobile ? "#mobile-scene" : "#product-scene",
  )!;
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  const viewportSize = () => ({
    width: innerWidth,
    height: mobile ? target.clientHeight : innerHeight,
  });
  const initialSize = viewportSize();
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
  renderer.setSize(initialSize.width, initialSize.height);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setClearColor(0, 0);
  target.append(renderer.domElement);
  progress?.("renderer", 1, "Загрузка текстур");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    initialSize.width / initialSize.height,
    0.1,
    mobile ? 500 : 30,
  );
  camera.position.set(0, 0, 8);
  const composition = new THREE.Group();
  composition.rotation.x = skipIntro ? 0 : 1;
  composition.position.z = skipIntro ? 0 : -3;
  // A separate root moves the prepared composition vertically without
  // changing product poses or the rotation used by the intro/scroll sequence.
  const arrival = new THREE.Group();
  arrival.add(composition);
  scene.add(arrival);
  setBuildPass("optimization-pass");
  const state = { scene, camera, gl: renderer };
  const clouds = setupCloudTransition();
  const cleanups = [clouds.dispose];
  const revealPivots: THREE.Group[] = [];
  let reveal: gsap.core.Timeline | undefined;
  const settleReveal = () => {
    reveal?.kill();
    arrival.position.y = 0;
    for (const pivot of revealPivots) {
      pivot.position.set(0, 0, 0);
      pivot.rotation.set(0, 0, 0);
    }
    renderer.domElement.dataset.introMotion = "settled";
  };
  let disposed = false;
  const readyTextures = preparePackagingTextures(
    renderer,
    undefined,
    (fraction) => {
      if (!disposed) progress?.("textures", fraction, "Подготовка текстур");
    },
  ).then(async () => {
    if (disposed) return;
    for (const [index, kind] of (
      ["zip", "pvd", "cup"] as ModelKind[]
    ).entries()) {
      await yieldScenePreparation();
      if (disposed) return;
      const group = new THREE.Group(),
        pivot = new THREE.Group(),
        model = createPackagingModel(kind);
      composition.add(group);
      group.add(pivot);
      pivot.add(model);
      revealPivots.push(pivot);
      cleanups.push(
        setupProductChoreography(
          model,
          group,
          kind,
          index,
          () => state,
          clouds.isForegroundActive,
        ),
      );
    }
    progress?.("models", 1, "Подготовка моделей");
  });
  let environment: THREE.Texture | undefined;
  const readyEnvironment = loadSceneEnvironment().then(
    (texture) => {
      if (disposed) {
        texture.dispose();
        return;
      }
      environment = texture;
      scene.environment = texture;
      progress?.("environment", 1, "Подготовка освещения");
    },
    (error) => {
      console.error("scene-environment-load", error);
      progress?.("environment", 1, "Подготовка освещения");
    },
  );
  const ready = Promise.all([readyEnvironment, readyTextures]).then(
    async () => {
      if (disposed) return;
      const prepared = await prepareFirstFrame(
        renderer,
        scene,
        camera,
        () => disposed,
        (fraction) => progress?.("frame", fraction, "Подготовка первого кадра"),
      );
      if (!prepared || disposed) return;
      cleanups.push(prepared.dispose);
      renderer.domElement.dataset.sceneMetrics = JSON.stringify({
        readyMs: Math.round(performance.now() - startedAt),
        preparation: prepared.metrics,
        textures: packagingTextureStats(),
        geometries: prepared.info.geometries,
        drawCalls: prepared.info.drawCalls,
        triangles: prepared.info.triangles,
        resources: performance
          .getEntriesByType("resource")
          .filter((entry) =>
            /\.(ktx2|wasm)$|basis_transcoder\.js$|\/textures\/|\/media\/optimized\/.*\.webp$/.test(
              entry.name,
            ),
          )
          .map((entry) => {
            const resource = entry as PerformanceResourceTiming;
            return {
              url: resource.name,
              transferBytes: resource.transferSize,
              bodyBytes: resource.encodedBodySize,
              durationMs: Math.round(resource.duration),
            };
          }),
      });
      if (
        !skipIntro &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        arrival.position.y = -7;
        const turns = [
          [0.35, -0.65, 0.18],
          [-0.25, 0.55, -0.16],
          [0.4, -0.45, 0.2],
        ];
        revealPivots.forEach((pivot, index) => {
          pivot.rotation.set(...(turns[index] as [number, number, number]));
          pivot.position.y = -[0.25, 0.55, 0.35][index];
          pivot.position.x = [-0.6, 0.45, 0.35][index];
        });
        // The warm-up frame above prepares all materials before the entrance.
        // Replace it before revealing the scene, then rise into the same poses.
        renderer.render(scene, camera);
        renderer.domElement.dataset.introMotion = "arriving";
        reveal = gsap.timeline({
          delay: 0.12,
          onComplete: settleReveal,
        });
        reveal.to(arrival.position, {
          y: 0,
          duration: 4.08,
          ease: "sine.inOut",
        });
        revealPivots.forEach((pivot, index) => {
          const timing = { duration: 3.64, ease: "sine.inOut" };
          reveal!.to(
            pivot.rotation,
            { x: 0, y: 0, z: 0, ...timing },
            index * 0.22,
          );
          reveal!.to(pivot.position, { x: 0, y: 0, ...timing }, index * 0.22);
        });
      } else {
        settleReveal();
      }
      progress?.("frame", 1, "Сцена готова");
      gsap.ticker.add(render);
      renderer.domElement.dataset.rendering = "active";
      ScrollTrigger.refresh();
    },
  );
  const enter = () => {
    // Touch scrolling can begin immediately: the whole composition must not
    // keep rotating underneath the section-driven product poses.
    if (mobile || skipIntro) {
      composition.rotation.set(0, 0, 0);
      composition.position.set(0, 0, 0);
      return;
    }
    gsap.to(composition.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: mobile ? 4 : 2,
      ease: "power4.inOut",
    });
    gsap.to(composition.position, {
      x: 0,
      y: 0,
      z: 0,
      duration: 2,
      ease: "power4.inOut",
    });
  };
  window.addEventListener("voi:enter", enter);
  // Navigation can reveal the hero before the deferred WebGL import finishes.
  if (!document.querySelector("#content.fix")) enter();
  const resize = () => {
    const size = viewportSize();
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
  };
  window.addEventListener("resize", resize);
  const onScroll = () => {
    // A fast scroll may reach product framing before the intro finishes.
    // Hand over neutral pivots immediately so section poses stay accurate.
    if (scrollY > 24 && renderer.domElement.dataset.introMotion === "arriving")
      settleReveal();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  const navigationObserver = new MutationObserver(() => {
    reveal?.paused(
      document.body.classList.contains("is-menu-open") ||
        document.body.classList.contains("is-route-transition"),
    );
  });
  navigationObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });
  let drewProducts = true;
  const render = () => {
    if (document.hidden || document.body.classList.contains("is-menu-open"))
      return;
    const visible = composition.children.some((group) => group.visible);
    if (visible !== drewProducts)
      renderer.domElement.dataset.rendering = visible ? "active" : "paused";
    // Clear once when the last product leaves; skip GPU work below the 3D
    // stories, while retaining choreography for reverse scrolling.
    if (visible || drewProducts) renderer.render(scene, camera);
    drewProducts = visible;
  };
  window.addEventListener("voi:capture-frame", render);
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    window.removeEventListener("voi:enter", enter);
    window.removeEventListener("resize", resize);
    window.removeEventListener("scroll", onScroll);
    navigationObserver.disconnect();
    window.removeEventListener("voi:capture-frame", render);
    gsap.killTweensOf(composition.rotation);
    gsap.killTweensOf(composition.position);
    gsap.killTweensOf(arrival.position);
    reveal?.kill();
    gsap.ticker.remove(render);
    cleanups.reverse().forEach((dispose) => dispose());
    environment?.dispose();
    disposeScene(scene);
    disposePackagingTextureUploads();
    renderer.dispose();
    renderer.domElement.remove();
  };
  return { dispose, ready };
}
