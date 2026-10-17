"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { formatETB } from "@/lib/format";
import AddToCartButton from "@/app/cart/AddToCartButton";
import useDebouncedValue from "./useDebouncedValue";

export default function SearchBox({ initialPage, initialCategory = "All" }) {
  const [term, setTerm] = useState("");
  const [page, setPage] = useState(1);
  const debouncedTerm = useDebouncedValue(term, 300);
  const category = initialCategory;
  const query = new URLSearchParams();

  if (debouncedTerm.trim()) {
    query.set("q", debouncedTerm.trim());
  }

  query.set("page", String(page));
  query.set("category", category);

  const key =
    term.trim() && !debouncedTerm.trim()
      ? null
      : `/api/dishes?${query.toString()}`;

  const { data, error, isLoading, isValidating } = useSWR(key, fetcher, {
    fallbackData:
      !term && page === 1 ? initialPage : undefined,
    keepPreviousData: true,
    dedupingInterval: 2000,
  });

  function updateTerm(value) {
    setTerm(value);
    setPage(1);
  }

  function updatePage(nextPage) {
    setPage(nextPage);

    const params = new URLSearchParams(window.location.search);
    params.set("page", String(nextPage));
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`,
    );
  }

  return (
    <section className="live-menu">
      <label className="search-label" htmlFor="dish-search">
        Search dishes
      </label>
      <input
        id="dish-search"
        className="search-input"
        value={term}
        onChange={(event) => updateTerm(event.target.value)}
        placeholder="Try Doro Wot, Tibs, coffee, vegetarian…"
      />

      <div className="results-heading">
        <span>
          {data ? `${data.total} dishes found` : "Searching dishes…"}
        </span>
        {isValidating ? <span className="muted">Updating…</span> : null}
      </div>

      {error && !data ? (
        <p role="alert">
          Could not load the menu. Check your connection and try again.
        </p>
      ) : null}

      {isLoading && !data ? (
        <p role="status">Loading menu…</p>
      ) : data?.items?.length ? (
        <div className="dish-grid">
          {data.items.map((dish) => (
            <article className="dish-card" key={dish.id}>
              <div className="dish-image">
                <Image
                  src={dish.image}
                  alt={`Traditional Ethiopian ${dish.name}`}
                  width={600}
                  height={400}
                  sizes="(max-width: 760px) 100vw, (max-width: 1120px) 50vw, 540px"
                  className="dish-photo"
                    />
              </div>
              <div className="dish-body">
                <div className="dish-top">
                  <h2>{dish.name}</h2>
                  <span>{formatETB(dish.price)}</span>
                </div>
                <span className="tag">{dish.category}</span>
                <p>{dish.description}</p>
                <div className="dish-actions">
                  <Link href={`/menu/${dish.id}`}>View dish</Link>
                  <AddToCartButton dish={dish} className="button primary small-button" />
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No dishes found</h2>
          <p>
            Nothing matches “{debouncedTerm}”. Try a different name or category.
          </p>
          <button
            className="button secondary"
            type="button"
            onClick={() => updateTerm("")}
          >
            Clear search
          </button>
        </div>
      )}

      {data ? (
        <div className="pagination" aria-label="Menu pages">
          <button
            type="button"
            onClick={() => updatePage(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            ← Previous
          </button>
          <span>
            Page {data.page} of {data.totalPages}
          </span>
          <button
            type="button"
            onClick={() => updatePage(Math.min(data.totalPages, page + 1))}
            disabled={page >= data.totalPages}
          >
            Next →
          </button>
        </div>
      ) : null}
    </section>
  );
}
