"use client";

import { useId, useState } from "react";
import styles from "./faq.module.css";

export function Faq({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const id = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className={styles.faq}>
      {items.map((item, index) => {
        const open = openIndex === index;
        const questionId = `${id}-${index}-question`;
        const answerId = `${id}-${index}-answer`;
        return (
          <div className={styles.item} key={item.question} data-open={open}>
            <h3 className={styles.heading}>
              <button
                className={styles.question}
                type="button"
                id={questionId}
                aria-expanded={open}
                aria-controls={answerId}
                onClick={() => setOpenIndex(open ? null : index)}
              >
                <span>{item.question}</span>
                <span className={styles.plus} aria-hidden="true">
                  +
                </span>
              </button>
            </h3>
            <div
              className={styles.answer}
              id={answerId}
              role="region"
              aria-labelledby={questionId}
              aria-hidden={!open}
              inert={!open}
            >
              <div className={styles.answerClip}>
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
