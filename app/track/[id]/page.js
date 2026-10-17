import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { getStoredOrder } from "@/lib/order-store";
import { formatETB, formatDateTime } from "@/lib/format";
import DeliveryMap from "./DeliveryMap";
import DeliveryLiveStatus from "./DeliveryLiveStatus";
import { csvForRows } from "@/lib/csv";

export const metadata = { title: "Track delivery", description: "Track your Addis Eats delivery.", robots: { index: false, follow: false } };

export default async function TrackDeliveryPage({ params }) {
  const { id } = await params;
  const user = await getSession();
  if (!user) redirect(`/signin?next=/track/${encodeURIComponent(id)}`);
  const stored = getStoredOrder(id);
  if (!stored) notFound();
  if (stored.ownerId !== user.id && !["staff", "admin"].includes(user.role)) notFound();
  const order = { ...stored, items: stored.items.map((item) => `${item.name} × ${item.quantity}`) };
  const csv = csvForRows([["Order ID", "Customer", "Area", "Status", "Total (ETB)", "Order Date"], [order.id, order.customer, order.area, order.status, order.total, order.date]]);
  return <main className="container page-content"><span className="eyebrow">DELIVERY TRACKING</span><h1>Track your delivery</h1><p>Order <strong>{order.id}</strong> · Delivery neighborhood: {order.neighborhood || order.area}</p><p><strong>Delivery address:</strong> {order.deliveryAddress || "Not provided"}</p>{order.mapLocation ? <p><strong>Map pin coordinates:</strong> {order.mapLocation}</p> : null}{order.landmark ? <p><strong>Nearby landmark:</strong> {order.landmark}</p> : null}<div className="card" style={{ padding: 20, margin: "20px 0" }}><DeliveryLiveStatus orderId={order.id} initialStatus={order.status} createdAt={order.createdAt} initialUpdatedAt={order.updatedAt} /><p><strong>Order total:</strong> {formatETB(order.total)}</p><p><strong>Order date:</strong> {formatDateTime(order.createdAt)}</p><p><strong>Items:</strong> {order.items.join(", ")}</p><a className="button" href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`} download={`${order.id}-delivery.csv`}>Export order as CSV</a></div><DeliveryMap area={order.area} /><p style={{ marginTop: 20 }}><Link href="/orders">Back to orders</Link></p></main>;
}
