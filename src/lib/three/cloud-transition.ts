import * as THREE from "three";
import type { SceneState } from "@/lib/three/types";
import { gsap } from "@/lib/motion/gsap";
import { isMobileScene } from "@/lib/motion/scene-layout";
import { sceneAsset } from "@/lib/three/scene-assets";

// Cloud layers use the page's existing
// ScrollSmoother position. A second scroller would desynchronise the products.
export function setupCloudTransition() {
  const scene = document.querySelector<HTMLElement>("#voi-cloud-transition");
  let active = false;
  let foregroundActive = false;
  if (!scene) return { dispose() {}, isForegroundActive: () => false };
  const mobile = isMobileScene();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hero = document.querySelector<HTMLElement>("#hero.voi-editorial-hero");
  const rearCanvas = document.querySelector<HTMLElement>(
    mobile ? "#mobile-scene" : "#product-scene",
  );
  const scrollHint = document.querySelector<HTMLElement>("#scroll");
  const layer = document.createElement("div");
  layer.id = "voi-cloud-layer";
  layer.hidden = true;
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML = `<div class="voi-clouds"><img class="voi-frontCloud" src="${sceneAsset("/media/product/media/cloud-transition/cloud-1-cropped.png")}" alt=""><img class="voi-rearCloud" src="${sceneAsset("/media/product/media/cloud-transition/cloud-2-full.png")}" alt=""></div><div class="voi-cloudMist"><img src="${sceneAsset("/media/product/media/cloud-transition/cloud-gradient.png")}" alt=""></div>`;
  document.querySelector("#product-scene-overlay")!.append(layer);
  const clamp = (v: number) => Math.max(0, Math.min(1, v)),
    smooth = (v: number) => v * v * (3 - 2 * v);
  function frame() {
    if (document.body.classList.contains("voi-shop-view")) {
      active = false;
      foregroundActive = false;
      layer.hidden = true;
      document.body.classList.remove(
        "voi-cloud-active",
        "voi-cloud-rear-hidden",
      );
      if (rearCanvas) rearCanvas.style.clipPath = "";
      if (scrollHint) scrollHint.style.clipPath = "";
      if (scrollHint) scrollHint.style.visibility = "hidden";
    } else if (
      !document.body.classList.contains("is-menu-open") &&
      !document.body.classList.contains("is-route-transition")
    ) {
      const r = scene!.getBoundingClientRect(),
        h = mobile
          ? document.querySelector<HTMLElement>("#mobile-scene")!.clientHeight
          : innerHeight;
      // A short pass at the hero boundary, independent of the long product story.
      const runway = h * 0.8;
      const p = Math.max(0, (h - r.top) / runway);
      // Lift the dense cloud body over the rear products before retiring them.
      // The backdrop must be opaque first, including in reduced-motion mode.
      const cover = smooth(clamp((p - 0.35) / 0.2));
      // Retire the remaining hero pixels while the cloud cover is fully opaque.
      // It must not reappear when that foreground layer starts dissolving.
      if (hero) hero.style.visibility = cover === 1 ? "hidden" : "";
      const frontY = Math.max(-40, 100 - p * (reduced ? 220 : 240));
      const opacity = smooth(clamp((r.bottom - h * 0.15) / (h * 0.3)));
      active = !document.querySelector("#content.fix") && p > 0 && opacity > 0;
      // Keep ZIP above the entering story while the hero still owns the
      // background layer, even after the cloud images have dissolved.
      foregroundActive =
        !document.querySelector("#content.fix") && p > 0 && r.bottom > 0;
      // At zero scroll the cloud images sit wholly below the viewport.
      // Revealing the layer therefore cannot introduce a full-screen backdrop.
      layer.hidden = !active;
      document.body.classList.toggle("voi-cloud-active", active);
      document.body.classList.toggle("voi-after-clouds", p > 0);
      document.body.classList.toggle(
        "voi-cloud-rear-hidden",
        !document.querySelector("#content.fix") && cover === 1,
      );
      layer.style.setProperty("--cloud-front-y", `${frontY}%`);
      layer.style.setProperty("--cloud-cover", String(cover));
      // Cut the rear pass under the dense part of the moving cloud. ZIP has
      // its own foreground pass, so its silhouette remains complete.
      const cutY = clamp((frontY + 75) / 100) * h;
      if (rearCanvas)
        rearCanvas.style.clipPath = foregroundActive
          ? `inset(0 0 ${Math.max(0, h - cutY)}px 0)`
          : "";
      if (scrollHint) {
        // Once the cloud has covered the hint, keep it retired when the
        // overlay dissolves. Reverse scrolling restores it with the hero.
        scrollHint.style.visibility = cover === 1 ? "hidden" : "";
        const hintRect = scrollHint.getBoundingClientRect();
        scrollHint.style.clipPath = foregroundActive
          ? `inset(0 0 ${Math.min(hintRect.height, Math.max(0, hintRect.bottom - cutY))}px 0)`
          : "";
      }
      layer.style.setProperty("--cloud-rear-y", `${smooth(clamp(p)) * 10}%`);
      layer.style.setProperty(
        "--cloud-mist-tilt",
        `${90 * (1 - smooth(clamp((p - 0.8) / 0.7)))}deg`,
      );
      layer.style.setProperty(
        "--cloud-mist-opacity",
        String(clamp((p - 0.72) / 0.12)),
      );
      layer.style.opacity = String(opacity);
    }
  }
  frame();
  gsap.ticker.add(frame);
  return {
    isForegroundActive: () => foregroundActive,
    dispose() {
      if (hero) hero.style.visibility = "";
      active = false;
      foregroundActive = false;
      gsap.ticker.remove(frame);
      layer.remove();
      if (rearCanvas) rearCanvas.style.clipPath = "";
      if (scrollHint) scrollHint.style.clipPath = "";
      if (scrollHint) scrollHint.style.visibility = "";
    },
  };
}

// A transparent pass draws only ZIP in front of the HTML clouds. Its complete
// world transform and camera are copied; PVD and cup stay in the rear canvas.
export function createCloudZip(
  object: THREE.Group,
  getState: () => SceneState,
  isForegroundActive: () => boolean,
) {
  const canvas = document.createElement("canvas");
  canvas.id = "voi-cloud-zip";
  canvas.setAttribute("aria-hidden", "true");
  document.querySelector("#product-scene-overlay")!.append(canvas);
  let renderer: THREE.WebGLRenderer | undefined;
  const overlay = new THREE.Scene(),
    copy = object.clone();
  copy.matrixAutoUpdate = false;
  overlay.add(copy);
  let width = 0,
    height = 0,
    lightsReady = false;
  function render() {
    if (
      document.hidden ||
      document.body.classList.contains("is-menu-open") ||
      document.body.classList.contains("is-home-arriving")
    )
      return;
    const state = getState(); // Keep the rear ZIP rendered: independent RAF loops must not hand off visibility.
    // The matching foreground pass only lifts it above the HTML clouds.
    canvas.hidden = !isForegroundActive();
    if (!isForegroundActive() || !state) return;
    // Allocate the second WebGL context only when the cloud overlay is needed.
    if (!renderer) {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
      renderer.setClearColor(0, 0);
    }
    const viewport = state.gl.domElement.getBoundingClientRect();
    if (width !== viewport.width || height !== viewport.height) {
      width = viewport.width;
      height = viewport.height;
      renderer.setPixelRatio(state.gl.getPixelRatio());
      renderer.setSize(width, height);
    }
    if (!lightsReady) {
      state.scene.traverse((node) => {
        if (node instanceof THREE.Light) {
          const light = node.clone();
          node.updateWorldMatrix(true, false);
          node.matrixWorld.decompose(
            light.position,
            light.quaternion,
            light.scale,
          );
          overlay.add(light);
        }
      });
      lightsReady = true;
    }
    object.updateWorldMatrix(true, true);
    copy.matrix.copy(object.matrixWorld);
    copy.visible = true;
    overlay.environment = state.scene.environment;
    renderer.outputEncoding = state.gl.outputEncoding;
    renderer.toneMapping = state.gl.toneMapping;
    renderer.toneMappingExposure = state.gl.toneMappingExposure;
    renderer.render(overlay, state.camera);
  }
  window.addEventListener("voi:capture-frame", render);
  // Choreography updates first; foreground rendering follows on the same tick.
  // Separate RAF loops could otherwise show different poses for one frame.
  gsap.ticker.add(render);
  return () => {
    gsap.ticker.remove(render);
    window.removeEventListener("voi:capture-frame", render);
    object.visible = true;
    canvas.remove();
    renderer?.dispose();
  };
}
