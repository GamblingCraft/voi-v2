"use client";
import { IntrinsicImage } from "@/components/media/intrinsic-image";

import { useCallback, useRef } from "react";
import Link from "next/link";
import { useScrollScene } from "./product-story/motion/use-scroll-scene";
import styles from "./water-journey.module.css";

const steps = [
  {
    name: "Байкал",
    eyebrow: "Источник",
    description: "Байкальская вода — основа льда ВОЙ.",
    href: "/product",
    image: "/media/baikal/bcksecondtest.png",
  },
  {
    name: "Производство",
    eyebrow: "Характер",
    description: "Собственное производство в Иркутске. От воды до готового льда.",
    href: "/production",
    image: "/media/production/sections/33.webp",
  },
  {
    name: "Форма",
    eyebrow: "Точность",
    description: "Куб, сфера и цилиндр. Для разных бокалов и рецептов.",
    href: "/catalog/formed",
    image: "/media/cooperation/2.webp",
  },
  {
    name: "Подача",
    eyebrow: "Детали",
    description: "Лёд становится частью напитка и подчёркивает его цвет.",
    href: "/cooperation",
    image: "/media/product/hero/1.webp",
  },
];

// Fine engraved contours: decorative details, separate from the text area.
function WaterEngraving({ kind }: { kind: number }) {
  return (
    <svg
      className={styles.engraving}
      viewBox="0 0 240 240"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth=".7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="120" cy="120" r="106" opacity=".3" />
        <path d="M120 6v15m0 198v15M6 120h15m198 0h15" opacity=".6" />
        {kind === 0 && (
          <>
            {Array.from({ length: 8 }, (_, i) => (
              <path
                key={i}
                d={`M28 ${112 + i * 9}C58 ${90 + i * 9} 80 ${136 + i * 9} 120 ${112 + i * 9}S184 ${90 + i * 9} 212 ${112 + i * 9}`}
                opacity={1 - i * 0.08}
              />
            ))}
            <path d="m35 105 41-54 25 32 31-48 70 70M62 69l14 13 12-12m32-17 12 14 11-12" />
          </>
        )}
        {kind === 1 && (
          <>
            {[36, 58, 80].map((r) => (
              <circle key={r} cx="120" cy="120" r={r} opacity=".55" />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <path
                key={i}
                transform={`rotate(${i * 60} 120 120)`}
                d="M120 28v92m-13-74 13 12 13-12m-24 20 11 10 11-10M120 88l-16 16 16 16 16-16Z"
              />
            ))}
          </>
        )}
        {kind === 2 && (
          <>
            <path d="m120 35 74 43v85l-74 43-74-43V78Zm-74 43 74 43 74-43m-74 43v85M120 35v86" />
            {[0.35, 0.65].map((t) => (
              <g key={t} opacity=".4">
                <path
                  d={`M${46 + 74 * t} ${78 - 43 * t}l74 43v85M46 ${78 + 85 * t}l74 43 74-43M${46 + 74 * t} ${163 + 43 * t}v-85l74-43`}
                />
              </g>
            ))}
          </>
        )}
        {kind === 3 && (
          <>
            <path d="M64 42h112l-10 85c-4 29-24 43-46 43s-42-14-46-43ZM120 170v34m-34 0h68M69 82h102M76 128c23-9 47 9 88 0" />
            <path d="m92 86 35-11 12 36-35 11Zm0 0 13 7 34 18m-34-18-1 29M177 47l7-14 7 14-7 14Z" />
            <ellipse cx="120" cy="42" rx="56" ry="8" opacity=".5" />
          </>
        )}
      </g>
    </svg>
  );
}

export function WaterJourney() {
  const root = useRef<HTMLElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const ball = useRef<SVGCircleElement>(null);
  const onProgress = useCallback((progress: number) => {
    if (!path.current || !ball.current) return;
    const point = path.current.getPointAtLength(
      path.current.getTotalLength() * progress,
    );
    ball.current.setAttribute("cx", String(point.x));
    ball.current.setAttribute("cy", String(point.y));
  }, []);
  const frozen = useScrollScene({
    sceneRef: root,
    screenRef: screen,
    kind: "journey",
    itemCount: steps.length,
    onProgress,
  });

  return (
    <section
      ref={root}
      className={styles.scene}
      data-frozen={frozen || undefined}
      aria-labelledby="water-journey-title"
      data-header-theme="dark"
    >
      <div ref={screen} className={styles.screen}>
        <header className={styles.header}>
          <h2 id="water-journey-title">
            Путь воды
            <br />
            <span>Характер льда</span>
          </h2>
          <p>
            От байкальской воды
            <br />
            до вашей подачи
          </p>
        </header>
        <div className={styles.viewport}>
          <div className={styles.track} data-story-track>
            {steps.map((step, i) => (
              <Link
                key={step.name}
                href={step.href}
                className={styles.card}
                onFocus={() => {
                  const scene = root.current;
                  if (!scene || scene.dataset.motion !== "scroll") return;
                  const top =
                    scene.getBoundingClientRect().top + window.scrollY;
                  window.scrollTo({
                    top:
                      top +
                      ((scene.offsetHeight -
                        (screen.current?.clientHeight ?? 0)) *
                        i) /
                        (steps.length - 1),
                    behavior: "instant",
                  });
                }}
              >
                <IntrinsicImage
                  className={styles.photo}
                  src={step.image}
                  alt=""
                  loading="lazy"
                />
                <span className={styles.shade} aria-hidden="true" />
                <span className={styles.index}>
                  0{i + 1} / {step.eyebrow}
                </span>
                <WaterEngraving kind={i} />
                <div className={styles.content}>
                  <h3>{step.name}</h3>
                  <p>{step.description}</p>
                  <span className={styles.action}>
                    Подробнее <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className={styles.timeline} aria-hidden="true">
          <span>01 / ИСТОЧНИК</span>
          <svg viewBox="0 0 1000 48" preserveAspectRatio="none">
            <path
              ref={path}
              d="M12 24C120 24 140 8 250 24S390 40 500 24 640 8 750 24 890 40 988 24"
            />
            <circle ref={ball} cx="12" cy="24" r="8" />
          </svg>
          <span>04 / ПОДАЧА</span>
        </div>
      </div>
    </section>
  );
}
