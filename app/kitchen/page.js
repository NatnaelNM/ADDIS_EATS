import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { listStoredOrders } from "@/lib/order-store";
import { formatETB } from "@/lib/format";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Staff kitchen",
  description: "Staff order management for Addis Eats.",
  robots: { index: false, follow: false },
};

export default async function KitchenPage() {
  const user = await getSession();
  if (!user) redirect("/signin?next=/kitchen");
  if (!["staff", "admin"].includes(user.role)) return <main className="container page-content"><h1>Access denied</h1><p>The kitchen dashboard is available to staff and admin accounts only.</p></main>;
  const orders = listStoredOrders().filter((order) => order.status !== "Delivered");
  return <main className="container page-content"><span className="eyebrow">STAFF OPERATIONS</span><h1>Kitchen dashboard</h1><p>Welcome, {user.name}. Active customer orders appear here.</p>{orders.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Status</th><th>Total</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><th>{order.id}</th><td>{order.customer}</td><td>{order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}</td><td>{order.status}</td><td>{formatETB(order.total)}</td></tr>)}</tbody></table></div> : <section className="empty-state"><h2>No active orders</h2><p>Orders will appear here after a customer checks out.</p></section>}</main>;
}
