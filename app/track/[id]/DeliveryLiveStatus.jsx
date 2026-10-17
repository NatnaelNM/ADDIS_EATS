"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDateTime, formatRelativeTime } from "@/lib/format";

const MINUTE = 60 * 1000;

function estimateDeliveryAt(status, createdAt, updatedAt) {
  if (status === "Delivered") return Date.now();
  const anchor = status === "On the way" && updatedAt ? updatedAt : createdAt;
  const duration = status === "On the way" ? 15 : 35;
  const parsed = new Date(anchor || Date.now()).getTime();
  return (Number.isFinite(parsed) ? parsed : Date.now()) + duration * MINUTE;
}

function countdown(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function DeliveryLiveStatus({ orderId, initialStatus, createdAt, initialUpdatedAt }) {
  const [status, setStatus] = useState(initialStatus);
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt || createdAt || new Date().toISOString());
  const [connection, setConnection] = useState("connecting");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const tick = window.setInterval(() => setNow(Date.now()), 1000);
    const source = new EventSource(`/api/orders/${encodeURIComponent(orderId)}/stream`);
    source.onopen = () => setConnection("live");
    source.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.status) setStatus(payload.status);
        if (payload.updatedAt) setUpdatedAt(payload.updatedAt);
        setConnection("live");
      } catch {
        setConnection("error");
      }
    };
    source.onerror = () => setConnection(source.readyState === EventSource.CLOSED ? "disconnected" : "reconnecting");
    return () => { window.clearInterval(tick); source.close(); };
  }, [orderId]);

  const eta = useMemo(() => estimateDeliveryAt(status, createdAt, updatedAt), [status, createdAt, updatedAt]);
  const remaining = Math.max(0, eta - now);
  const estimateLabel = status === "Delivered" ? "Delivered" : remaining === 0 ? "Due now" : countdown(remaining);

  return (
    <section aria-live="polite" className="delivery-live-status">
      <p><strong>Current status:</strong> {status}</p>
      <p><strong>Estimated delivery:</strong> <span className="delivery-countdown" aria-label={status === "Delivered" ? "Order delivered" : `${Math.ceil(remaining / 60000)} minutes estimated remaining`}>{estimateLabel}</span> {status === "Delivered" ? "— your order has arrived." : "remaining (estimate)"}</p>
      <p><strong>Connection:</strong> {connection === "live" ? "Live updates connected" : connection}</p>
      <p><strong>Last update:</strong> <time dateTime={updatedAt}>{formatDateTime(updatedAt)}</time> ({formatRelativeTime(updatedAt)})</p>
      <p className="muted">Delivery time is an estimate based on order status, not a live courier GPS feed.</p>
    </section>
  );
}
