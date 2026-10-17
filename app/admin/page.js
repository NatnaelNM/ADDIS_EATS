import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { listStoredOrders } from "@/lib/order-store";
import { formatETB } from "@/lib/format";
import DeleteOrderButton from "./DeleteOrderButton";
import ClearOrdersButton from "./ClearOrdersButton";
import OrderStatusControl from "./OrderStatusControl";
import ExportOrdersButton from "./ExportOrdersButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin dashboard", description: "Addis Eats administration dashboard.", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const user = await getSession();
  if (!user) redirect("/signin?next=/admin");
  if (user.role !== "admin") return <main className="container page-content"><section className="error-state"><h1>Admin access required</h1><p>This area is restricted to administrators.</p><Link className="button primary" href="/">Return home</Link></section></main>;

  const orders = listStoredOrders().sort((a, b) => String(b.createdAt || b.date).localeCompare(String(a.createdAt || a.date)));
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const delivered = orders.filter((order) => order.status === "Delivered").length;
  const active = orders.filter((order) => order.status !== "Delivered").length;

  return <main className="container page-content admin-page">
    <div className="admin-welcome"><div><span className="eyebrow">ADMINISTRATION</span><h1>Welcome, {user.name}</h1><p>Manage current orders and monitor the Addis Eats service.</p></div><span className="admin-role">Administrator</span></div>
    <nav className="admin-shortcuts" aria-label="Admin tools">
      <Link href="/orders?sort=date&dir=desc&page=1"><span className="shortcut-icon">01</span><span><strong>Order management</strong><small>Review and remove orders</small></span><span aria-hidden="true">↗</span></Link>
      <Link href="/dashboard"><span className="shortcut-icon">02</span><span><strong>Reports & analytics</strong><small>Review current order totals</small></span><span aria-hidden="true">↗</span></Link>
      <Link href="/kitchen"><span className="shortcut-icon">03</span><span><strong>Kitchen operations</strong><small>Open the order queue</small></span><span aria-hidden="true">↗</span></Link>
    </nav>
    <section aria-labelledby="admin-summary-title"><div className="admin-section-heading"><div><span className="eyebrow">LIVE SUMMARY</span><h2 id="admin-summary-title">Overview</h2></div></div>
      <div className="metric-grid admin-metrics">
        <article className="metric-card"><span>Total orders</span><strong>{orders.length}</strong><small>Orders created in this running session</small></article>
        <article className="metric-card"><span>Revenue</span><strong>{formatETB(revenue)}</strong><small>Sum of current order totals</small></article>
        <article className="metric-card"><span>Active orders</span><strong>{active}</strong><small>Not yet delivered</small></article>
        <article className="metric-card"><span>Delivered</span><strong>{delivered}</strong><small>Marked as delivered</small></article>
      </div>
    </section>
    <section className="report-card admin-report" aria-labelledby="admin-orders-title">
      <div className="admin-section-heading"><div><span className="eyebrow">ORDER MANAGEMENT</span><h2 id="admin-orders-title">Orders</h2><p>{orders.length ? "Manage or delete individual orders, or clear the complete list." : "No orders have been placed yet."}</p></div><div className="admin-actions"><ExportOrdersButton orders={orders} />{orders.length ? <ClearOrdersButton /> : null}<Link className="button secondary" href="/orders?sort=date&dir=desc&page=1">All orders</Link></div></div>
      {orders.length === 0 ? <div className="empty-state"><h3>No orders yet</h3><p>The dashboard is clean. Orders will appear here after customers place them.</p></div> : <div className="table-scroll"><table className="data-table"><caption>Current orders managed by the administrator</caption><thead><tr><th>Order ID</th><th>Date</th><th>Customer</th><th>Area</th><th>Status</th><th className="numeric">Total</th><th>Actions</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><th scope="row">{order.id}</th><td>{order.date || "—"}</td><td>{order.customer || "—"}</td><td>{order.neighborhood || order.area || "—"}{order.deliveryAddress ? <><br /><small>{order.deliveryAddress}</small></> : null}{order.landmark ? <><br /><small>Landmark: {order.landmark}</small></> : null}{order.mapLocation ? <><br /><small>Map pin: {order.mapLocation}</small></> : null}</td><td><OrderStatusControl orderId={order.id} initialStatus={order.status} /></td><td className="numeric">{formatETB(Number(order.total || 0))}</td><td><DeleteOrderButton orderId={order.id} /></td></tr>)}</tbody></table></div>}
    </section>
  </main>;
}
