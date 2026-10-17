import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { listStoredOrders } from "@/lib/order-store";
import OrderTable from "./OrderTable";
import { formatETB } from "@/lib/format";

function formatOrderTotal(value) { return formatETB(Number(value || 0)); }

export const dynamic = "force-dynamic";
export const metadata = { title: "Order records", description: "A paginated, sortable view of Addis Eats order records.", robots: { index: false, follow: false } };
const sortable = new Set(["id", "date", "area", "status", "total"]);

export default async function OrdersPage({ searchParams }) {
  const user = await getSession();
  if (!user) redirect("/signin?next=/orders");
  const allOrders = listStoredOrders();
  // Customers only ever receive their own orders. Staff/admin reporting is role-gated.
  if (user.role === "customer") {
    const mine = allOrders
      .filter((order) => order.ownerId === user.id)
      .sort((a, b) => String(b.createdAt || b.date).localeCompare(String(a.createdAt || a.date)));
    return <main className="container page-content orders-list-page">
      <div className="page-heading"><div><span className="eyebrow">YOUR ACCOUNT</span><h1>My orders</h1><p>Only orders placed from your account are shown here.</p></div><Link className="button secondary" href="/menu">Order food</Link></div>
      {mine.length === 0 ? <section className="empty-state"><h2>You have no orders yet</h2><p>Your orders will appear here after you complete checkout.</p><Link className="button primary" href="/menu">Browse the menu</Link></section> : <section className="report-card"><div className="table-scroll"><table className="data-table"><caption>Your orders</caption><thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Status</th><th className="numeric">Total</th><th>Details</th></tr></thead><tbody>{mine.map((order) => <tr key={order.id}><th scope="row">{order.id}</th><td>{order.date || "—"}</td><td>{order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}</td><td><span className="status-pill">{order.status}</span></td><td className="numeric">{formatOrderTotal(order.total)}</td><td><Link href={`/orders/${encodeURIComponent(order.id)}`}>View order</Link></td></tr>)}</tbody></table></div></section>}
    </main>;
  }
  if (!["staff", "admin"].includes(user.role)) return <main className="container page-content"><h1>Access denied</h1><p>Order reporting is available to staff and admin accounts only.</p><Link href="/">Return home</Link></main>;
  const params = await searchParams;
  const sort = sortable.has(params?.sort) ? params.sort : "date";
  const dir = params?.dir === "asc" ? "asc" : "desc";
  const pageSize = 5;
  const sorted = allOrders.sort((a, b) => {
    const left = a[sort], right = b[sort];
    const compare = typeof left === "number" ? left - right : String(left).localeCompare(String(right));
    return dir === "asc" ? compare : -compare;
  });
  const total = sorted.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const requestedPage = Number.parseInt(params?.page || "1", 10);
  const page = Number.isFinite(requestedPage) ? Math.min(pages, Math.max(1, requestedPage)) : 1;
  const rows = sorted.slice((page - 1) * pageSize, page * pageSize);
  return <main className="container page-content orders-list-page">
    <div className="page-heading"><div><span className="eyebrow">STAFF REPORTING</span><h1>Order records</h1><p>Review and manage order records.</p></div><Link className="button secondary" href="/dashboard">Back to dashboard</Link></div>
    <section className="report-card"><OrderTable orders={rows} page={page} pages={pages} sort={sort} dir={dir} total={total} /></section>
  </main>;
}
