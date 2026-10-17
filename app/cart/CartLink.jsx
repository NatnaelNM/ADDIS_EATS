"use client";

import Link from "next/link";
import { useCart } from "../providers";

export default function CartLink() {
  const { itemCount, hydrated } = useCart();

  return (
    <Link href="/cart" aria-label={`Cart, ${itemCount} items`}>
      Cart
      {hydrated && itemCount > 0 ? (
        <span className="cart-count" aria-label={`${itemCount} items in cart`}>
          {itemCount}
        </span>
      ) : null}
    </Link>
  );
}
