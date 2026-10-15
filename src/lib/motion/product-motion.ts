import {
  gsap,
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  registerMotionPlugins,
} from "./gsap";
import { isMobileScene } from "./scene-layout";

export function setupProductMotion(root: HTMLElement, restoreScroll?: number) {
  registerMotionPlugins();
  const mobile = isMobileScene();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const splits: SplitText[] = [];
  const scrollSpeed = 0.7;
  let smoother: ScrollSmoother | undefined;
  const context = gsap.context(() => {
    if (!mobile && !reduced) {
      smoother = ScrollSmoother.create({
        wrapper: "#wrapper",
        content: "#content",
        smooth: 1.2,
        smoothTouch: 1.2,
        speed: scrollSpeed,
        normalizeScroll: false,
        ignoreMobileResize: true,
        effects: true,
      });
    }
    const hero = root.querySelector<HTMLElement>("#hero.voi-editorial-hero");
    const heroImage = hero?.querySelector("img");
    if (hero && heroImage && !reduced) {
      gsap.fromTo(
        heroImage,
        { yPercent: 0, scale: 1.08 },
        {
          yPercent: 22,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }
    if (mobile || reduced) return;
    for (const element of root.querySelectorAll(".section-heading")) {
      const outer = new SplitText(element, {
        type: "lines,chars",
        charsClass: "tit2",
      });
      splits.push(outer);
      const split = new SplitText(outer.chars, {
        type: "chars",
        charsClass: "tit2in",
      });
      splits.push(split);
      gsap.to(split.chars, {
        scrollTrigger: { trigger: element, start: "top 90%" },
        y: 0,
        stagger: 0.03,
        duration: 1,
      });
    }
    for (const element of root.querySelectorAll(".section-subheading")) {
      const outer = new SplitText(element, {
        type: "lines,words",
        linesClass: "tit3",
      });
      splits.push(outer);
      const split = new SplitText(outer.words, {
        type: "words",
        wordsClass: "tit3in",
      });
      splits.push(split);
      gsap.to(split.words, {
        scrollTrigger: { trigger: element, start: "top 100%" },
        y: 0,
        stagger: 0.1,
        duration: 0.8,
      });
    }
    for (const element of root.querySelectorAll(".text")) {
      const split = new SplitText(element, {
        type: "lines,words",
        linesClass: "linein",
      });
      splits.push(split);
      gsap.from(split.lines, {
        scrollTrigger: { trigger: element, start: "top 100%" },
        duration: 0.8,
        ease: "power4.out",
        y: 0.05 * innerWidth,
        stagger: 0.08,
      });
    }
    splits.push(new SplitText(".text", { type: "lines", linesClass: "line" }));
  }, root);
  const onScroll = (event: Event) => {
    const target = (event as CustomEvent<string>).detail;
    if (target === "#top") {
      if (smoother) smoother.scrollTo(0, true);
      else
        window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
      return;
    }
    if (smoother) smoother.scrollTo(target, true, "top top");
    else
      root
        .querySelector(target)
        ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
  };
  window.addEventListener("voi:scroll", onScroll);
  if (restoreScroll !== undefined) {
    if (smoother)
      smoother.scrollTop(restoreScroll * (smoother.smooth() ? scrollSpeed : 1));
    else window.scrollTo({ top: restoreScroll, behavior: "instant" });
  }
  return {
    enter() {
      window.dispatchEvent(new Event("voi:enter"));
    },
    pause(paused: boolean) {
      smoother?.paused(paused);
    },
    refresh() {
      ScrollTrigger.refresh();
    },
    dispose() {
      window.removeEventListener("voi:scroll", onScroll);
      context.revert();
      splits.reverse().forEach((split) => split.revert());
      smoother?.kill();
    },
  };
}
