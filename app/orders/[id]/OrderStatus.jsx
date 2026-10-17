"use client";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";

export default function OrderStatus({ id, initial }) {
  const { data, error, isLoading, isValidating } = useSWR(`/api/orders/${id}`, fetcher, {
    fallbackData: initial,
    refreshInterval: 5000,
    revalidateOnFocus: true,
    dedupingInterval: 2000
  });
  if (isLoading && !data) return <p role="status">Loading order…</p>;
  if (error && !data) return <p role="alert">Could not load this order. Please refresh.</p>;
  return <section className="order-status-card">
    <div className="dish-top"><h2>Order #{data.id}</h2><span className="tag">{data.status}</span></div>
    <p><strong>Items:</strong> {data.items.join(", ")}</p>
    <p><strong>Delivery neighborhood:</strong> {data.neighborhood || data.area || "—"}</p>
    <p><strong>Delivery address:</strong> {data.deliveryAddress || "—"}</p>{data.mapLocation ? <p><strong>Map pin coordinates:</strong> {data.mapLocation}</p> : null}
    {data.landmark ? <p><strong>Nearby landmark:</strong> {data.landmark}</p> : null}
    <p><strong>Total:</strong> {data.total} ETB</p>
    <p className="muted">{isValidating ? "Checking for updates…" : "Automatically checks every 5 seconds."}</p>
    {error && <p role="alert">Showing the last available status; the latest refresh failed.</p>}
  </section>;
}
