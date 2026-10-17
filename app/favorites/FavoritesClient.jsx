"use client";

import Link from "next/link";
import DishList from "@/app/menu/DishList";
import { useCart } from "@/app/providers";

export default function FavoritesClient({ dishes }) {
  const { favorites, hydrated } = useCart();
  if (!hydrated) return <p role="status">Loading your favorites…</p>;
  const savedDishes = dishes.filter((dish) => favorites.includes(dish.id));
  if (!savedDishes.length) return <section className="empty-state"><h2>No favorites saved yet</h2><p>Browse the menu and tap the heart on any dish to keep it here.</p><Link className="button primary" href="/menu">Browse menu</Link></section>;
  return <DishList dishes={savedDishes} />;
}
