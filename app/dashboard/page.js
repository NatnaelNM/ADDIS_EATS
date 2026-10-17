import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { listStoredOrders } from "@/lib/order-store";
import { formatETB } from "@/lib/format";
import RevenueChart from "./RevenueChart";
import OrdersLineChart from "./OrdersLineChart";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Data dashboard",
  description: "Revenue and order activity for Addis Eats.",
  robots: { index: false, follow: false },
};

export default async function DashboardPage({ searchParams }) {
  const user = await getSession();
  if (!user) redirect("/signin?next=/dashboard");
  if (!["staff", "admin"].includes(user.role)) return <main className="container page-content"><h1>Access denied</h1><p>The data dashboard is available to staff and admin accounts only.</p><Link href="/">Return home</Link></main>;

  await searchParams;
  const orders = listStoredOrders();
  const areas = ["Bole", "Kazanchis", "Megenagna"];
  const revenueByArea = areas.map((area) => ({
    area,
    revenue: orders.filter((order) => order.area === area).reduce((sum, order) => sum + order.total, 0),
  }));
  const dailyOrders = [...new Set(orders.map((order) => order.date))].sort().map((date) => ({
    day: new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`)),
    orders: orders.filter((order) => order.date === date).length,
  }));
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return <main className="container page-content dashboard-page">
    <div className="page-heading"><div><span className="eyebrow">STAFF REPORTING</span><h1>Data dashboard</h1><p>Revenue and order activity from current orders.</p></div><Link className="button secondary" href="/orders">View all orders</Link></div>
    <div className="metric-grid">
      <article className="metric-card"><span>Total orders</span><strong>{orders.length}</strong><small>Current orders</small></article>
      <article className="metric-card"><span>Revenue</span><strong>{formatETB(totalRevenue)}</strong><small>Sum of current order totals</small></article>
    </div>
    {orders.length === 0 ? <section className="empty-state large"><h2>No dashboard data yet</h2><p>New orders will appear here after checkout.</p><Link className="button secondary" href="/admin">Back to admin</Link></section> : <>
      <section className="report-card"><div className="section-heading"><div><h2>Revenue by neighbourhood</h2><p>Revenue from orders by neighbourhood, in ETB.</p></div></div><RevenueChart data={revenueByArea} />
        <div className="table-scroll"><table className="data-table"><caption>Revenue by neighbourhood</caption><thead><tr><th scope="col">Neighbourhood</th><th scope="col" className="numeric">Revenue (ETB)</th></tr></thead><tbody>{revenueByArea.map((row) => <tr key={row.area}><th scope="row">{row.area}</th><td className="numeric">{formatETB(row.revenue)}</td></tr>)}</tbody></table></div>
      </section>
      <section className="report-card"><div className="section-heading"><div><h2>Orders over time</h2><p>Orders per day based on current records.</p></div></div><OrdersLineChart data={dailyOrders} />
        <div className="table-scroll"><table className="data-table"><caption>Orders per day</caption><thead><tr><th scope="col">Date</th><th scope="col" className="numeric">Orders</th></tr></thead><tbody>{dailyOrders.map((row) => <tr key={row.day}><th scope="row">{row.day}</th><td className="numeric">{row.orders}</td></tr>)}</tbody></table></div>
      </section>
    </>}
  </main>;
}
