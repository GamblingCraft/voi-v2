"use client";

import Image from "next/image";
import { useEffect, useRef, type PointerEvent } from "react";
import layout from "../styles/editorial-layout.module.css";
import styles from "./cooperation-steps.module.css";

type Step = { title: string; text: string; image: string };

export function CooperationSteps({ steps }: { steps: Step[] }) {
  const preview = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hide = () => preview.current?.removeAttribute("data-active");
    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("blur", hide);
    return () => {
      window.removeEventListener("scroll", hide);
      window.removeEventListener("blur", hide);
    };
  }, []);

  function move(event: PointerEvent<HTMLLIElement>, index: number) {
    if (event.pointerType !== "mouse" || !preview.current) return;
    const element = preview.current;
    const size = window.innerWidth * 0.17361111;
    const x = Math.max(
      12,
      Math.min(event.clientX + 24, window.innerWidth - size - 12),
    );
    const y = Math.max(
      12,
      Math.min(event.clientY - size / 2, window.innerHeight - size - 12),
    );
    element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    element.dataset.active = String(index);
  }

  return (
    <div>
      <ol
        className={layout.steps}
        onPointerLeave={() => preview.current?.removeAttribute("data-active")}
      >
        {steps.map((step, index) => (
          <li
            key={step.title}
            onPointerEnter={(event) => move(event, index)}
            onPointerMove={(event) => move(event, index)}
          >
            <span className={layout.index}>0{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
      <div ref={preview} className={styles.preview} aria-hidden="true">
        {steps.map((step, index) => (
          <div key={step.title} className={styles.frame} data-frame={index}>
            <Image src={step.image} alt="" fill sizes="18vw" />
          </div>
        ))}
      </div>
    </div>
  );
}
