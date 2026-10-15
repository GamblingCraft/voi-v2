import * as THREE from "three";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { isMobileScene } from "@/lib/motion/scene-layout";
import { createPackagingModel, packagingBounds } from "./packaging";
import {
  preparePackagingTextures,
  packagingTextureStats,
} from "./packaging/textures";
import { createProductClip } from "./product-clipping";
import { createCloudZip } from "./cloud-transition";
import { disposeScene } from "./dispose-scene";
import { lerp, blendVector, clamp01 } from "@/lib/math";
import type {
  ModelKind,
  SceneState,
  VectorTuple,
  ScreenRect,
} from "@/lib/three/types";
export function setupProductChoreography(
  object: THREE.Group,
  g: THREE.Group,
  kind: ModelKind,
  index: number,
  getState: () => SceneState,
  isCloudForegroundActive: () => boolean,
) {
  const mobile = isMobileScene();
  const initial: VectorTuple = (
    mobile
      ? [
          [0.4, 1.7, 0],
          [-1.05, 0.1, 0],
          [1.1, 0.1, 0],
        ]
      : [
          [0.5, 2.9, -0.7],
          [-3.5, 0, 0],
          [3.2, 0, 0],
        ]
  )[index] as VectorTuple;
  const rotations: VectorTuple = [
    [0.2, -0.3, -0.3],
    [-0.25, 0.25, -0.25],
    [0.5, -0.2, 0.3],
  ][index] as VectorTuple;
  const gs = gsap,
    modelScale = object.scale.x;
  const captureFrame = () => {
    const state = getState();
    state.gl.render(state.scene, state.camera);
  };
  if (index === 0) window.addEventListener("voi:capture-frame", captureFrame);
  const section = ["#zip-story", "#pvd-story", "#cup-story"][index];
  const frame = ["#zip-frame", "#pvd-frame", "#cup-frame"][index],
    label = [
      ".product-stage.zip-stage",
      ".product-stage.pvd-stage",
      ".product-stage.cup-stage",
    ][index];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const phase = {
    lift: 0,
    heroTurn: 0,
    zipMove: 0,
    zipTurn: 0,
    enter: 0,
    travel: 0,
    cardTurn: 0,
    inspect: 0,
    exit: 0,
  };
  const tweens: gsap.core.Tween[] = [];
  const track = (
    key: keyof typeof phase,
    trigger: string,
    start: string,
    end: string,
    ease = "power4.inOut",
    endTrigger = trigger,
  ) => {
    // Native touch scroll is sampled once per rendered pose below. Mixing
    // ScrollTrigger's cached progress with live DOM rectangles causes jumps.
    if (mobile) return;
    tweens.push(
      gs.fromTo(
        phase,
        { [key]: 0 },
        {
          [key]: 1,
          ease,
          immediateRender: false,
          scrollTrigger: {
            trigger,
            start,
            endTrigger,
            end,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      ),
    );
  };
  if (index === 0) {
    track("zipMove", "#hero", "top top", "bottom 10%");
    track("zipTurn", "#hero", "top top", "top top", "none", "#zip-landscape");
  } else {
    track("heroTurn", "#hero", "top top", "bottom top", "none");
    track("lift", "#hero", "top -70%", "bottom -30%");
    track(
      "enter",
      section,
      index === 1 ? "top 120%" : "top 110%",
      "top bottom",
    );
    track(
      "travel",
      section,
      mobile ? (index === 1 ? "top 75%" : "top 50%") : "top bottom",
      "bottom top",
    );
  }
  const blend3 = blendVector,
    clamp = clamp01,
    tau = Math.PI * 2;
  const restRotation = [
    [0, tau, mobile ? 0 : tau],
    [0, tau + 0.1, mobile ? -0.07 : tau - 0.07],
    [Math.PI / 2, 0, 0],
  ][index];
  const entryPosition = [
    [0, 0.2, 0],
    [4.8, 7, 0],
    [0, 7, 0],
  ][index];
  // Each package has its own silhouette and framing inside the showcase.
  let framing = [
    mobile ? [0.94, 0.68, 0.33] : [0.94, 0.98, 0.5],
    [1.04, 1.08, 0.54],
    [0.9, 0.75, 0.44],
  ][index];
  const prefix = ["zip", "pvd", "cup"][index];
  const showcase = document.querySelector<HTMLElement>(
    "#" + prefix + "-showcase",
  );
  const showcaseTarget = document.querySelector<HTMLElement>(
    "#" + prefix + "-model-target",
  );
  const landscape = document.querySelector("#" + prefix + "-landscape");
  const landscapeBackground = document.querySelector<HTMLElement>(
    "#" + prefix + "-landscape-background",
  );
  const productCard = document.querySelector<HTMLElement>(
    "#" + prefix + "-product-card",
  );
  const nextSection = document.querySelector(
    ["#pvd-story", "#cup-story", "#closing-story"][index],
  );
  const clipProduct = createProductClip(object);
  const heroElement = document.querySelector("#hero")!;
  const introduction = document.querySelector<HTMLElement>(
    "#product-intro-model",
  );
  const storyElement = document.querySelector(section)!;
  const smoothProgress = (value: number) => {
    const p = clamp(value);
    return p * p * (3 - 2 * p);
  };
  const vector = object.position.clone(),
    box = packagingBounds(object),
    corners: THREE.Vector3[] = [];
  for (const x of [box.min.x, box.max.x])
    for (const y of [box.min.y, box.max.y])
      for (const z of [box.min.z, box.max.z])
        corners.push(vector.clone().set(x, y, z));
  const renderPose = () => {
    // The live menu card transforms viewport rectangles. Keep the last
    // section pose until it returns; WebGL itself remains the live canvas.
    if (
      document.body.classList.contains("is-menu-open") ||
      document.body.classList.contains("is-home-arriving")
    )
      return;
    const viewport = getState().gl.domElement.getBoundingClientRect();
    if (!viewport.width || !viewport.height) return;
    const h = mobile ? viewport.height : innerHeight,
      w = innerWidth;
    const heroRect = heroElement.getBoundingClientRect();
    const storyRect = storyElement.getBoundingClientRect();
    const landscapeRect = landscape?.getBoundingClientRect();
    if (mobile) {
      const distance = Math.max(0, -heroRect.top);
      phase.heroTurn = clamp(distance / heroRect.height);
      phase.zipMove = smoothProgress(distance / (heroRect.height - h * 0.1));
      phase.zipTurn = clamp(
        distance / Math.max(1, (landscapeRect?.top ?? 0) + distance),
      );
      phase.lift = smoothProgress(
        (distance - heroRect.height * 0.5) / (h * 0.5),
      );
      phase.enter = smoothProgress((h * 1.15 - storyRect.top) / (h * 0.5));
      phase.travel = smoothProgress(
        (h - storyRect.top) /
          Math.max(
            1,
            (landscapeRect?.top ?? storyRect.bottom) - storyRect.top + h,
          ),
      );
    }
    framing = [
      mobile
        ? innerWidth > innerHeight
          ? [0.94, 0.98, 0.5]
          : [0.94, 0.68, 0.33]
        : [0.94, 0.98, 0.5],
      [1.04, 1.08, 0.54],
      [0.9, 0.75, 0.44],
    ][index];
    if (mobile && innerWidth > innerHeight && index > 0)
      framing = index === 1 ? [0.5, 0.58, 0.51, 0.3] : [0.46, 0.52, 0.5, 0.3];
    if (index === 0) {
      const hero = document.querySelector("#hero"),
        b = hero?.getBoundingClientRect();
      document.body.classList.toggle(
        "voi-hero-active",
        !introduction &&
          (!!document.querySelector("#content.fix") ||
            (!!b && b.top < innerHeight && b.bottom > 0)),
      );
    }
    // Ease into the slower foreground surface while the page keeps scrolling.
    let sceneRect: DOMRect | null = null;
    let sceneOffset = 0,
      coverTop = innerHeight;
    if (mobile && index !== 0) {
      const stage = document.querySelector(label)?.getBoundingClientRect();
      phase.exit = stage && stage.bottom <= 0 ? 1 : 0;
    }
    if (landscape && landscapeBackground) {
      sceneRect = landscapeRect!;
      const overlap = h * 0.6;
      const hold = Math.max(0, sceneRect.height - h - overlap);
      const feather = h * 0.16;
      const softPositive = (value: number) =>
        value <= -feather
          ? 0
          : value >= feather
            ? value
            : ((value + feather) * (value + feather)) / (4 * feather);
      const travel = -sceneRect.top;
      const counterScroll = reduced
        ? 0
        : softPositive(travel) - softPositive(travel - hold - h);
      // The softened hold must never push the incoming photograph below its
      // section edge: that reveals a strip of the previous landscape at the top.
      const backgroundOffset = Math.min(
        Math.max(0, travel),
        Math.max(0, counterScroll),
      );
      landscapeBackground.style.transform = `translateY(${backgroundOffset}px)`;
      sceneOffset = sceneRect.top + backgroundOffset;
      coverTop = Math.min(h, nextSection!.getBoundingClientRect().top);
      // Use the same live boundary for the photograph and its foreground model.
      landscapeBackground.style.clipPath = `inset(0 0 ${Math.max(
        0,
        sceneOffset + landscapeBackground.offsetHeight - coverTop,
      )}px 0)`;
      phase.exit = coverTop <= 0 ? 1 : 0;
    }
    {
      // A reverse swipe only rewinds the current section. Other packages stay
      // outside the viewport until their own entrance (or the hero) is reached.
      const heroVisible = heroRect.bottom > 0;
      const ownSectionVisible =
        index === 0
          ? (landscapeRect?.bottom ?? 0) > 0 && coverTop > 0
          : storyRect.top < h * 1.15 &&
            (landscapeRect?.bottom ?? 0) > 0 &&
            coverTop > 0;
      g.visible = introduction
        ? ownSectionVisible &&
          (index !== 0 ||
            introduction.getBoundingClientRect().top - h * 0.22 < h)
        : ownSectionVisible ||
          (heroVisible &&
            !(
              index > 0 &&
              document.body.classList.contains("voi-cloud-rear-hidden")
            ));
    }
    let position: VectorTuple = [...initial],
      rotation: VectorTuple = [...rotations];
    if (index === 0) {
      position = blend3(initial, [0, 0.2, 0], phase.zipMove);
      rotation = blend3(rotations, restRotation, phase.zipTurn);
      rotation[1] += tau * phase.cardTurn;
    } else {
      position[1] = lerp(initial[1], 7, phase.lift);
      position = blend3(position, entryPosition, phase.enter);
      // Start both rear products turning with the first scroll, then blend
      // from that pose into their own section's existing choreography.
      const heroTurn = reduced ? 0 : phase.heroTurn;
      const heroRotation: VectorTuple = [
        rotations[0] + heroTurn * (index === 1 ? 0.65 : 1.1),
        rotations[1] + heroTurn * tau * (index === 1 ? 0.65 : -0.55),
        rotations[2] + heroTurn * (index === 1 ? -0.7 : 0.6),
      ];
      const entryRotation = mobile
        ? blend3(
            heroRotation,
            [0.45, 0.2, index === 2 ? 0.15 : -0.15],
            phase.enter,
          )
        : index === 2
          ? blend3(heroRotation, [0.5, 0.35, 0.2], phase.enter)
          : heroRotation;
      position = blend3(position, [0, index === 2 ? 0.3 : 0, 0], phase.travel);
      if (mobile && heroRect.bottom <= 0) {
        position = blend3(
          [index === 1 ? 1.8 : 0, 3.4, 0],
          [0, index === 2 ? 0.3 : 0, 0],
          phase.travel,
        );
      }
      rotation = blend3(entryRotation, restRotation, phase.travel);
    }
    const scale = 1 - phase.exit;
    const desktopFit = mobile ? 1 : Math.min(1, w / h / (16 / 9));
    let freeScale = desktopFit;
    rotation[1] += phase.inspect;
    g.position.set(...position);
    g.position.x *= desktopFit;
    g.rotation.set(...rotation);
    g.scale.setScalar(scale);
    object.position.set(0, 0, 0);
    object.scale.setScalar(modelScale * freeScale);
    const element = document.querySelector(frame),
      camera = getState().camera;
    if (!element || !camera) return;
    const originalRect = element.getBoundingClientRect();
    const gl = getState().gl;
    gl.localClippingEnabled = true;
    clipProduct(camera, viewport, coverTop);
    const lock = sceneRect
      ? clamp((h - sceneRect.top) / h)
      : clamp((h - originalRect.top) / (h * 0.75));
    let frameBlend = mobile
      ? smoothProgress(lock)
      : gs.parseEase("power4.inOut")(lock);
    let r: ScreenRect = originalRect;
    if (showcase && showcaseTarget) {
      // Target follows the marked recess in the actual background's cover crop.
      const cover = Math.max(w / 2752, h / 1536),
        bw = 2752 * cover,
        bh = 1536 * cover;
      const portrait = mobile && w < h;
      let cropX = index === 1 && portrait ? 0.78 : 0.5;
      if (index === 1 && !mobile && bw > w) {
        const right = (w - bw) / 2 + bw * 0.89;
        cropX = Math.min(1, 0.5 + Math.max(0, right - (w - 32)) / (bw - w));
      }
      if (index === 1 && landscapeBackground)
        landscapeBackground.style.backgroundPosition = `${cropX * 100}% center`;
      const backgroundTop = sceneOffset;
      const recess =
        index === 0
          ? [0.405, 0.265, 0.185, 0.448]
          : [0.635, 0.265, 0.255, 0.585];
      let left = (w - bw) * cropX + bw * recess[0],
        top = (h - bh) / 2 + bh * recess[1] + backgroundTop,
        width = bw * recess[2],
        height = bh * recess[3];
      if (index === 1) {
        top -= 15;
        framing = [0.92, 0.9, 0.44];
        if (portrait) {
          const right = Math.min(w - 16, left + width);
          left = Math.max(16, left);
          width = Math.max(80, right - left);
        }
        if (!portrait) {
          const cardWidth = Math.min(310, bw * 0.205);
          showcase.style.setProperty(
            "--pvd-card-left",
            Math.max(
              cardWidth / 2 + 24,
              Math.min(w - cardWidth / 2 - 24, (w - bw) * cropX + bw * 0.27),
            ) + "px",
          );
          showcase.style.setProperty(
            "--pvd-card-top",
            (h - bh) / 2 + bh * 0.51 + "px",
          );
          showcase.style.setProperty("--pvd-card-width", cardWidth + "px");
        }
      }
      if (index === 2) {
        width = w * (portrait ? 0.75 : 0.38);
        height = h * (portrait ? 0.49 : 0.68);
        left = (w - width) / 2;
        top = backgroundTop + h * (portrait ? 0.12 : 0.16);
        framing = [0.85, 0.72, 0.46, portrait ? 0.52 : 0.5];
        if (!mobile) {
          const cardWidth = Math.max(240, Math.min(310, w * 0.22));
          showcase.style.setProperty(
            "--cup-card-left",
            Math.max(
              24,
              Math.min(w * 0.13, left + width * 0.075 - cardWidth - 24),
            ) + "px",
          );
        }
      }
      Object.assign(showcaseTarget.style, {
        left: left + "px",
        top: top + "px",
        width: width + "px",
        height: height + "px",
      });
      r = { left, top, width, height };
      const visibility = frameBlend * (1 - phase.exit),
        cardVisibility =
          gs.parseEase("power3.out")(clamp((lock - 0.9) / 0.1)) *
          (index === 0 ? clamp((phase.zipTurn - 0.97) / 0.03) : 1) *
          (1 - phase.exit);
      showcase.style.setProperty("--showcase-opacity", String(visibility));
      showcase.style.setProperty("--card-opacity", String(cardVisibility));
      showcase.style.setProperty(
        "--card-offset",
        (1 - cardVisibility) * 28 + "px",
      );
      showcase.style.setProperty("--scene-offset", sceneOffset + "px");
      const cardRect = productCard!.getBoundingClientRect();
      productCard!.style.clipPath = `inset(0 0 ${Math.max(0, cardRect.bottom - coverTop)}px 0)`;
      showcase.classList.toggle("is-active", visibility > 0.01);
      showcase.classList.toggle("card-ready", cardVisibility > 0.95);
      productCard!.inert = cardVisibility <= 0.95 || cardRect.bottom > coverTop;
      showcase.setAttribute(
        "aria-hidden",
        visibility > 0.01 ? "false" : "true",
      );
      document.body.classList.toggle(
        prefix + "-showcase-active",
        visibility > 0.01,
      );
      if (portrait && (h < 760 || index === 1)) {
        // Reserve a stable card area. Reading its animated top feeds the
        // previous frame's offset back into the package's size.
        const cardTop = mobile
          ? backgroundTop + h - 24 - cardRect.height
          : cardRect.top - (1 - cardVisibility) * 28;
        const available = Math.max(
          80,
          Math.min(height * 0.68, cardTop - 20 - top),
        );
        framing = [0.94, available / height, (available * 0.5) / height];
      }
    }
    if (showcase && !mobile) {
      g.rotation.set(
        ...blend3(
          rotation,
          restRotation.map((v, i) => v + (i === 1 ? phase.inspect : 0)),
          frameBlend,
        ),
      );
    }
    if (index === 2 && !reduced) {
      // Apply the full somersault after docking's pose blend so fixation
      // cannot erase the turn halfway through. 2π ends at the same rest pose.
      g.rotation.x += tau * smoothProgress(lock);
    }
    if (mobile) {
      const travel = index === 0 ? phase.zipMove : phase.travel;
      freeScale = lerp(0.72, 0.8, travel);
      object.scale.setScalar(modelScale * freeScale);
    }
    // Start travel at the second section, not when the following story enters.
    // Keep a single continuous pose until the original landscape takes over.
    if (index === 0 && introduction) {
      const intro = introduction.getBoundingClientRect();
      const brand = introduction.closest("section")!.getBoundingClientRect();
      const distance = Math.max(1, (landscapeRect?.top ?? h) - brand.top);
      const fall = reduced ? 0 : clamp(-brand.top / distance);
      const weight = 1 - smoothProgress(lock);
      const entryOffset = clamp(brand.top / h) * h * 0.22;
      if (weight > 0) {
        r = {
          left: lerp(r.left, intro.left, weight),
          top: lerp(
            r.top,
            intro.top + Math.max(0, -brand.top) - entryOffset + fall * h * 0.18,
            weight,
          ),
          width: lerp(r.width, intro.width, weight),
          height: lerp(r.height, intro.height, weight),
        };
        framing = [
          lerp(framing[0], 0.95, weight),
          lerp(framing[1], 0.95, weight),
          lerp(framing[2], 0.5, weight),
        ];
        frameBlend = lerp(frameBlend, 1, weight);
        g.position.multiplyScalar(1 - weight);
        g.rotation.set(
          ...blend3(
            [g.rotation.x, g.rotation.y, g.rotation.z],
            [
              0.16 * (1 - fall),
              -0.35 + fall * tau,
              0.55 + fall * (mobile ? -0.55 : tau - 0.55),
            ],
            weight,
          ),
        );
      }
      // A small overlap reveals the package before the section fills the screen.
      const top = Math.max(0, brand.top - h * 0.22);
      getState().gl.domElement.style.clipPath = `inset(${Math.min(h, top)}px 0 0)`;
    }
    // Keep a restrained live pose after fixation, within the same fit bounds.
    const idleTime = gs.ticker.time * 0.7 + index * 1.7,
      idleWeight = frameBlend * (1 - phase.exit);
    const idleX =
        reduced || index === 2 ? 0 : Math.sin(idleTime) * 4 * idleWeight,
      idleY =
        reduced || index === 2 ? 0 : Math.cos(idleTime * 0.8) * 3 * idleWeight;
    if (!reduced && index !== 2) {
      g.rotation.x += Math.sin(idleTime * 0.8) * 0.025 * idleWeight;
      g.rotation.y += Math.sin(idleTime * 0.65) * 0.07 * idleWeight;
      g.rotation.z += Math.cos(idleTime * 0.75) * 0.018 * idleWeight;
    }
    // The larger introductory floating blends into the subtle fixed cup-story.
    if (!reduced && frameBlend < 1 && phase.exit < 1) {
      const time = gs.ticker.time * 0.9 + index * 1.7,
        free = 1 - frameBlend;
      g.position.y += Math.sin(time) * 0.085 * free;
      g.position.x += Math.sin(time * 0.6) * 0.035 * free;
      g.rotation.x += Math.cos(time * 0.5) * 0.045 * free;
      g.rotation.y += Math.sin(time * 0.4) * 0.06 * free;
      g.rotation.z += Math.sin(time * 0.45) * 0.045 * free;
    }
    if (frameBlend < 0.001 || scale < 0.001) return;
    g.scale.setScalar(1);
    g.updateWorldMatrix(true, true);
    const anchor = g.getWorldPosition(vector.clone());
    const ray = vector
      .clone()
      .set(
        ((r.left + r.width * (framing[3] ?? 0.5) + idleX - viewport.left) /
          viewport.width) *
          2 -
          1,
        1 -
          ((r.top + r.height * framing[2] + idleY - viewport.top) /
            viewport.height) *
            2,
        0.5,
      )
      .unproject(camera)
      .sub(camera.position)
      .normalize();
    const target = camera.position
      .clone()
      .addScaledVector(ray, (anchor.z - camera.position.z) / ray.z);
    g.worldToLocal(target);
    object.position.copy(target).multiplyScalar(frameBlend);
    // Fit the full-size silhouette, so the fit never cancels the exit's shrinking.
    object.scale.setScalar(modelScale);
    g.updateWorldMatrix(true, true);
    let xmin = Infinity,
      xmax = -Infinity,
      ymin = Infinity,
      ymax = -Infinity;
    for (const corner of corners) {
      const p = corner.clone().applyMatrix4(object.matrixWorld).project(camera);
      xmin = Math.min(xmin, p.x);
      xmax = Math.max(xmax, p.x);
      ymin = Math.min(ymin, p.y);
      ymax = Math.max(ymax, p.y);
    }
    const fit = Math.min(
      1.6,
      (r.width * framing[0]) / ((xmax - xmin) * viewport.width * 0.5),
      (r.height * framing[1]) / ((ymax - ymin) * viewport.height * 0.5),
    );
    object.scale.setScalar(modelScale * lerp(freeScale, fit, frameBlend));
    g.scale.setScalar(scale);
    // Once the incoming surface covers the entire silhouette, stop drawing the
    // outgoing package rather than retaining a clipped foreground pass until
    // the section reaches the very top. Recompute each tick for reverse scroll.
    if (g.visible && coverTop < h) {
      g.updateWorldMatrix(true, true);
      let top = Infinity;
      for (const corner of corners) {
        const point = corner
          .clone()
          .applyMatrix4(object.matrixWorld)
          .project(camera);
        top = Math.min(
          top,
          viewport.top + (1 - point.y) * viewport.height * 0.5,
        );
      }
      g.visible = coverTop > top - 1;
    }
  };
  renderPose();
  gs.ticker.add(renderPose);
  const disposeCloudZip =
    index === 0
      ? createCloudZip(object, getState, isCloudForegroundActive)
      : () => {};
  let weightRequest = 0;
  const event = async (e: Event) => {
    if (kind === "pvd") {
      const request = ++weightRequest;
      const kg = (e as CustomEvent<number>).detail;
      try {
        await preparePackagingTextures(getState().gl, [
          `/media/product/textures/pvd-${kg}-alpha.png`,
          `/media/product/textures/pvd-${kg}-back-alpha.png`,
        ]);
      } catch (error) {
        console.error("packaging-weight-load", error);
        return;
      }
      if (request !== weightRequest) return;
      const replacement = createPackagingModel("pvd", kg);
      disposeScene(object);
      object.clear();
      for (const c of [...replacement.children]) object.add(c);
      object.userData.kg = kg;
      getState().gl.domElement.dataset.pvdWeight = String(kg);
      getState().gl.domElement.dataset.textureStats = JSON.stringify(
        packagingTextureStats(),
      );
    }
  };
  window.addEventListener("voi:weight", event);
  const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
  return () => {
    cancelAnimationFrame(refreshFrame);
    weightRequest++;
    disposeCloudZip();
    window.removeEventListener("voi:capture-frame", captureFrame);
    gs.ticker.remove(renderPose);
    tweens.forEach((t) => {
      t.scrollTrigger?.kill();
      t.kill();
    });
    gs.killTweensOf(phase);
    if (landscapeBackground) {
      landscapeBackground.style.removeProperty("transform");
      landscapeBackground.style.removeProperty("clip-path");
    }
    window.removeEventListener("voi:weight", event);
    if (showcase) {
      showcase.classList.remove("is-active", "card-ready");
      document.body.classList.remove(prefix + "-showcase-active");
      if (index === 0) document.body.classList.remove("voi-hero-active");
    }
  };
}
