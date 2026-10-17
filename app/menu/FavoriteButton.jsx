"use client";

import { useCart } from "@/app/providers";

export default function FavoriteButton({ dish, compact = false }) {
  const { favorites, toggleFavorite } = useCart();
  const saved = favorites.includes(dish.id);
  return <button
    type="button"
    className={compact ? "favorite-button favorite-button-compact" : "favorite-button"}
    aria-pressed={saved}
    aria-label={saved ? `Remove ${dish.name} from favorites` : `Add ${dish.name} to favorites`}
    onClick={() => toggleFavorite(dish.id)}
  >
    <span aria-hidden="true">{saved ? "♥" : "♡"}</span>{compact ? "" : saved ? " Saved" : " Favorite"}
  </button>;
}
