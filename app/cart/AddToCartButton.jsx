"use client";

import { useState } from "react";
import { useCart } from "../providers";

export default function AddToCartButton({ dish, className = "button primary" }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(dish);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button className={className} type="button" onClick={handleAdd}>
      {added ? "Added to cart ✓" : "Add to cart"}
    </button>
  );
}
