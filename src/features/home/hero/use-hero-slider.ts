"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { heroSlides as slides } from "./hero-slides";
export function useHeroSlider() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const previousSlide = useRef(0);
  const firstSlide = useRef(true);
  const [videoDurations, setVideoDurations] = useState<number[]>([]);
  const duration = videoDurations[slide] ?? 6;
  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;
    const old = previousSlide.current;
    previousSlide.current = slide;
    if (firstSlide.current) {
      firstSlide.current = false;
      return;
    }
    const backgrounds = root.querySelectorAll(".voi-slide");
    const titles = root.querySelectorAll(".voi-hero-content");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timeline = gsap.timeline();
    timeline.fromTo(
      backgrounds[old],
      { autoAlpha: 1, zIndex: 1 },
      { autoAlpha: 0, scale: 1, y: -40, duration: 1, ease: "power2.inOut" },
      0,
    );
    timeline.fromTo(
      titles[old],
      { autoAlpha: 1, zIndex: 1 },
      { autoAlpha: 0, x: 10, duration: 0.5, ease: "power2.inOut" },
      0,
    );
    timeline.fromTo(
      backgrounds[slide],
      { autoAlpha: 0, scale: 1.1, y: 40, zIndex: 2 },
      { autoAlpha: 1, scale: 1.05, y: 0, duration: 0.75, ease: "power2.inOut" },
      0.25,
    );
    timeline.fromTo(
      titles[slide],
      { autoAlpha: 0, x: -10, zIndex: 2 },
      { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.inOut" },
      0.25,
    );
    const strip = root.querySelector<HTMLElement>(".voi-thumbs");
    const active = strip?.querySelector<HTMLElement>("button.active");
    if (strip && active)
      strip.scrollTo({
        left: Math.min(
          active.offsetLeft - 20,
          strip.scrollWidth - strip.clientWidth,
        ),
        behavior: "smooth",
      });
    return () => {
      timeline.kill();
    };
  }, [slide]);
  useEffect(() => {
    const root = heroRef.current;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lines = root.querySelectorAll(".voi-thumb-progress");
    lines.forEach((line, i) => gsap.set(line, { scaleX: i < slide ? 1 : 0 }));
    const progress = gsap.to(lines[slide], {
      scaleX: 1,
      duration,
      ease: "none",
      paused,
      onComplete: () => setSlide((s) => (s + 1) % slides.length),
    });
    const visibility = () => {
      if (document.hidden || paused) progress.pause();
      else progress.resume();
    };
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !paused && !document.hidden)
        progress.resume();
      else progress.pause();
    });
    observer.observe(root);
    return () => {
      progress.kill();
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [slide, paused, duration]);
  return { slide, setSlide, paused, setPaused, heroRef, setVideoDurations };
}
