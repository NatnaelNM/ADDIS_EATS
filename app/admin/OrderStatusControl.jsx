"use client";

import { useState } from "react";

const statuses = ["Preparing", "On the way", "Delivered"];

export default function OrderStatusControl({ orderId, initialStatus }) {
  const [status, setStatus] = useState(initialStatus || "Preparing");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function updateStatus(nextStatus) {
    if (nextStatus === status || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Could not update status");
      setStatus(payload.status || nextStatus);
      setMessage("Saved");
    } catch (error) {
      setMessage(error.message || "Update failed");
    } finally {
      setBusy(false);
    }
  }

  return <div className="order-status-control">
    <label className="sr-only" htmlFor={`status-${orderId}`}>Order status for {orderId}</label>
    <select id={`status-${orderId}`} value={status} disabled={busy} onChange={(event) => updateStatus(event.target.value)}>
      {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
    </select>
    <small aria-live="polite">{busy ? "Saving…" : message}</small>
  </div>;
}
