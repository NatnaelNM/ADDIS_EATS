"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useState } from "react";
import dynamic from "next/dynamic";
import { formatETB } from "@/lib/format";
import { dishes } from "@/lib/dishes";
import { placeOrder } from "../actions";
import { useCart } from "../providers";
const LocationPicker = dynamic(() => import("./LocationPicker"), { ssr: false, loading: () => <div className="form-row"><strong>Pin your exact delivery location (optional)</strong><p className="field-help">Loading map…</p></div> });

export default function CheckoutForm() {
  const [state, action, pending] = useActionState(placeOrder, null);
  const requestId = useId();
  const [requestKey, setRequestKey] = useState(requestId);
  const { items, hydrated, clearCart } = useCart();

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

  useEffect(() => {
    if (hydrated) {
      setRequestKey(`${requestId}-${window.crypto.randomUUID()}`);
    }
  }, [hydrated, requestId]);

  useEffect(() => {
    if (!state?.id) return;

    clearCart();
  }, [state?.id, clearCart]);

  if (!hydrated) {
    return <div className="checkout-card">Loading your cart…</div>;
  }

  if (state?.id) {
    return (
      <section className="checkout-card order-success" aria-live="polite">
        <span className="success-mark" aria-hidden="true">✓</span>
        <h2>Order received</h2>
        <p>{state.message}</p>
        <div className="order-confirmation">
          <span>Order reference</span>
          <strong>{state.id}</strong>
          <span>Order total</span>
          <strong>{formatETB(state.total || 0)}</strong>
        </div>
        <p className="muted">
          This classroom version keeps order records in server memory. They can
          reset when the server restarts.
        </p>
        <Link className="button primary full" href={`/orders/${state.id}`}>
          View order status
        </Link>
        <Link className="back-link" href="/menu">
          Back to the menu
        </Link>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="checkout-card empty-checkout">
        <h2>Your cart is empty</h2>
        <p>Add at least one dish before placing an order.</p>
        <Link className="button primary full" href="/menu">
          Browse Ethiopian dishes
        </Link>
      </section>
    );
  }

  return (
    <form className="checkout-card" action={action} aria-busy={pending}>
      <section className="checkout-summary" aria-label="Order summary">
        <h2>Order summary</h2>
        {cartItems.map((item) => (
          <div className="checkout-summary-row" key={item.id}>
            <span>
              {item.name} <span className="muted">× {item.quantity}</span>
            </span>
            <strong>{formatETB(item.price * item.quantity)}</strong>
          </div>
        ))}
        <div className="checkout-summary-total">
          <span>Total</span>
          <strong>{formatETB(total)}</strong>
        </div>
      </section>

      <input type="hidden" name="requestId" value={requestKey} />
      <input type="hidden" name="items" value={JSON.stringify(items)} />

      <div className="form-row">
        <label htmlFor="checkout-phone">Phone number</label>
        <input
          id="checkout-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="09… or +2519…"
          required
        />
        {state?.fieldErrors?.phone ? (
          <p className="form-error" role="alert">{state.fieldErrors.phone[0]}</p>
        ) : null}
      </div>

      <div className="form-row">
        <label htmlFor="checkout-neighborhood">Delivery neighborhood</label>
        <select id="checkout-neighborhood" name="neighborhood" defaultValue="" required>
          <option value="" disabled>Select your neighborhood</option>
          <option value="Bole">Bole</option>
          <option value="Piassa">Piassa</option>
          <option value="Kazanchis">Kazanchis</option>
          <option value="Sar Bet">Sar Bet</option>
          <option value="CMC">CMC</option>
          <option value="Megenagna">Megenagna</option>
          <option value="Mexico">Mexico</option>
          <option value="Lideta">Lideta</option>
          <option value="Arat Kilo">Arat Kilo</option>
          <option value="Gurd Shola">Gurd Shola</option>
          <option value="Other">Other</option>
        </select>
        {state?.fieldErrors?.neighborhood ? (
          <p className="form-error" role="alert">{state.fieldErrors.neighborhood[0]}</p>
        ) : null}
      </div>

      <LocationPicker />

      <div className="form-row delivery-location-field">
        <label htmlFor="checkout-address">Street / house / building directions <span aria-hidden="true">*</span></label>
        <textarea
          id="checkout-address"
          name="deliveryAddress"
          autoComplete="street-address"
          placeholder="Enter your street, house/building number, compound, or a clear description of where to deliver"
          rows={4}
          minLength={5}
          maxLength={500}
          required
        />
        <p className="field-help">Please provide enough detail for the courier to find your home or workplace.</p>
        {state?.fieldErrors?.deliveryAddress ? (
          <p className="form-error" role="alert">{state.fieldErrors.deliveryAddress[0]}</p>
        ) : null}
      </div>

      <div className="form-row">
        <label htmlFor="checkout-landmark">Nearby landmark (optional)</label>
        <input
          id="checkout-landmark"
          name="landmark"
          type="text"
          autoComplete="off"
          placeholder="e.g. near a school, hotel, or main road"
          maxLength={160}
        />
        {state?.fieldErrors?.landmark ? (
          <p className="form-error" role="alert">{state.fieldErrors.landmark[0]}</p>
        ) : null}
      </div>

      {state?.error ? (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      ) : null}

      <button className="button primary full" type="submit" disabled={pending}>
        {pending ? "Placing order…" : "Place order"}
      </button>
      <small>
        Signed-in account name is attached automatically. There is no name field at checkout. Select a neighborhood, optionally pin the exact point on the map, and enter delivery directions. Phone number, neighborhood, and directions are required.
      </small>
    </form>
  );
}
