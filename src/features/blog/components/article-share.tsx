"use client";

import { Check, Share2 } from "@deemlol/next-icons";
import { useEffect, useRef, useState } from "react";
import styles from "./article-share.module.css";

export function ArticleShare() {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const copying = useRef(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  async function copyLink() {
    if (copying.current) return;
    copying.current = true;
    if (resetTimer.current) clearTimeout(resetTimer.current);
    try {
      await navigator.clipboard.writeText(
        `${location.origin}${location.pathname}`,
      );
      setStatus("copied");
      resetTimer.current = setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
    } finally {
      copying.current = false;
    }
  }
  const copied = status === "copied";
  return (
    <div className={styles.share}>
      <button
        data-ui-action
        type="button"
        className={styles.button}
        data-copied={copied || undefined}
        onClick={copyLink}
        aria-label="Скопировать ссылку на статью"
      >
        <span
          className={styles.label}
          data-visible={!copied}
          aria-hidden="true"
        >
          <Share2 size={16} strokeWidth={1.5} /> Поделиться статьёй
        </span>
        <span className={styles.label} data-visible={copied} aria-hidden="true">
          <Check size={16} strokeWidth={1.5} /> Скопировано
        </span>
      </button>
      <span className={styles.announcement} role="status" aria-atomic="true">
        {copied ? "Ссылка скопирована" : ""}
      </span>
      {status === "error" && (
        <span className={styles.error} role="status">
          Не удалось скопировать. Ссылка доступна в адресной строке.
        </span>
      )}
    </div>
  );
}
