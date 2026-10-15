"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Search, X } from "@deemlol/next-icons";
import styles from "./header-search-button.module.css";

type HeaderSearchButtonProps = {
  openLabel: string;
  closeLabel: string;
  placeholder: string;
  submitLabel: string;
  onSearch?: (query: string) => void;
};

export function HeaderSearchButton({
  openLabel,
  closeLabel,
  placeholder,
  submitLabel,
  onSearch,
}: HeaderSearchButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 180);

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node) && !query) {
        setIsOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, query]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedQuery = query.trim();
    if (normalizedQuery) onSearch?.(normalizedQuery);
  };

  const toggleSearch = () => {
    setIsOpen((currentValue) => {
      if (currentValue) setQuery("");
      return !currentValue;
    });
  };

  return (
    <div
      ref={containerRef}
      className={styles.search}
      data-open={isOpen ? "true" : "false"}
    >
      <form
        className={styles.form}
        role="search"
        aria-hidden={!isOpen}
        onSubmit={handleSubmit}
      >
        <Search
          className={styles.fieldIcon}
          size={18}
          strokeWidth={1.6}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          className={styles.input}
          type="search"
          value={query}
          placeholder={placeholder}
          aria-label={placeholder}
          tabIndex={isOpen ? 0 : -1}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button className={styles.srSubmit} type="submit" tabIndex={-1}>
          {submitLabel}
        </button>
      </form>

      <button
        className={styles.toggle}
        type="button"
        aria-label={isOpen ? closeLabel : openLabel}
        aria-expanded={isOpen}
        onClick={toggleSearch}
      >
        {isOpen ? (
          <X size={20} strokeWidth={1.6} aria-hidden="true" />
        ) : (
          <Search size={21} strokeWidth={1.6} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
