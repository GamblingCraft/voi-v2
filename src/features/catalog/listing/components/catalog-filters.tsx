"use client";

import { useState } from "react";
import Form from "next/form";
import Link from "next/link";
import filtersStyles from "./catalog-filters.module.css";

type Option = { id: string; label: string };
type Props = {
  categoryHref: string;
  shape: string;
  usage: string;
  q: string;
  sort: string;
  shapes: Option[];
  usages: Option[];
};

export function CatalogFilters({
  shape,
  usage,
  sort,
  shapes,
  usages,
  categoryHref,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={filtersStyles.filterPanel} data-expanded={expanded}>
      <button
        type="button"
        className={filtersStyles.mobileFilters}
        aria-expanded={expanded}
        aria-controls="catalog-filter-fields"
        onClick={() => setExpanded(!expanded)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M3 7h18M3 17h18" />
          <circle cx="8" cy="7" r="2.5" />
          <circle cx="16" cy="17" r="2.5" />
        </svg>
        Фильтры и сортировка{" "}
        <span aria-hidden="true">{expanded ? "−" : "+"}</span>
      </button>
      <div id="catalog-filter-fields" className={filtersStyles.filterContent}>
        <Form
          id="catalog-filters"
          action={`${categoryHref}#discover`}
          className={filtersStyles.filters}
          onSubmit={() => setExpanded(false)}
        >
          <h3>Подобрать лёд</h3>
          <fieldset>
            <legend>Форма</legend>
            {[{ id: "all", label: "Все формы" }, ...shapes].map((item) => (
              <label className={filtersStyles.radio} key={item.id}>
                <input
                  type="radio"
                  name="shape"
                  value={item.id}
                  defaultChecked={shape === item.id}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Подача</legend>
            {usages.map((item) => (
              <label className={filtersStyles.radio} key={item.id}>
                <input
                  type="radio"
                  name="usage"
                  value={item.id}
                  defaultChecked={usage === item.id}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </fieldset>
          <label className={filtersStyles.sort}>
            Сортировка
            <select name="sort" defaultValue={sort}>
              <option value="featured">По умолчанию</option>
              <option value="name">По названию</option>
            </select>
          </label>
          <button data-ui-action className={filtersStyles.apply} type="submit">
            Применить фильтры
          </button>
          <Link
            className={filtersStyles.resetFilters}
            href={`${categoryHref}#discover`}
          >
            Сбросить
          </Link>
        </Form>
      </div>
    </div>
  );
}
