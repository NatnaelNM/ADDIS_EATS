"use client";

import Image from "next/image";
import Link from "next/link";
import { dishes } from "@/lib/dishes";
import { formatETB } from "@/lib/format";
import { useCart } from "../providers";

export default function CartClient() {
  const {
    items,
    hydrated,
    setQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const cartItems = items
    .map((item) => {
      const dish = dishes.find((entry) => entry.id === item.id);

      return dish ? { ...dish, quantity: item.quantity } : null;
    })
    .filter(Boolean);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (!hydrated) {
    return (
      <main className="container cart-page">
        <div className="page-heading">
          <div>
            <span className="eyebrow">YOUR ORDER</span>
            <h1>Your cart</h1>
            <p>Loading your saved cart…</p>
          </div>
        </div>
        <div className="empty-state" aria-live="polite">Preparing your cart…</div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="container cart-page">
        <div className="page-heading">
          <div>
            <span className="eyebrow">YOUR ORDER</span>
            <h1>Your cart is empty</h1>
            <p>Add your favorite Ethiopian dishes and they will appear here.</p>
          </div>
        </div>
        <section className="empty-state large">
          <span className="empty-cart-icon" aria-hidden="true">🛍️</span>
          <h2>Nothing in your cart yet</h2>
          <p>Start with Doro Wot, Tibs, Kitfo, or a vegetarian favorite.</p>
          <Link className="button primary" href="/menu">
            Explore the menu
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="container cart-page">
      <div className="page-heading cart-heading">
        <div>
          <span className="eyebrow">YOUR ORDER</span>
          <h1>Your cart</h1>
          <p>{cartItems.length} dish types ready for your order.</p>
        </div>
        <button className="text-button" type="button" onClick={clearCart}>
          Clear cart
        </button>
      </div>

      <section className="cart-card" aria-label="Cart items">
        <div className="cart-items-list">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.id}>
              <div className="cart-thumb">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={120}
                  height={100}
                  sizes="100px"
                  className="cart-photo"
                    />
              </div>
              <div className="cart-info">
                <h2>{item.name}</h2>
                <p>{formatETB(item.price)} each</p>
                <button
                  className="remove-link"
                  type="button"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
              <div className="quantity" aria-label={`${item.name} quantity`}>
                <button
                  type="button"
                  aria-label={`Decrease ${item.name} quantity`}
                  onClick={() => setQuantity(item.id, item.quantity - 1)}
                >
                  −
                </button>
                <span aria-live="polite">{item.quantity}</span>
                <button
                  type="button"
                  aria-label={`Increase ${item.name} quantity`}
                  onClick={() => setQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <strong className="cart-line-total">
                {formatETB(item.price * item.quantity)}
              </strong>
            </article>
          ))}
        </div>

        <div className="cart-total">
          <span>Order total</span>
          <strong>{formatETB(total)}</strong>
        </div>
        <p className="cart-note">
          Delivery fees are not included in this classroom demo.
        </p>
        <Link className="button primary full" href="/checkout">
          Continue to checkout
        </Link>
        <Link className="back-link" href="/menu">
          ← Add more dishes
        </Link>
      </section>
    </main>
  );
}
