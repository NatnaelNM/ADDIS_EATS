import Link from "next/link";
import { formatETB } from "@/lib/format";

function queryHref({ page, sort, dir }) {
  const params = new URLSearchParams({ page: String(page), sort, dir });
  return `/orders?${params.toString()}`;
}

export default function OrderTable({ orders, page, pages, sort, dir, total }) {
  const nextDir = dir === "asc" ? "desc" : "asc";
  const sortLink = (key) => queryHref({ page: 1, sort: key, dir: sort === key ? nextDir : (key === "date" ? "desc" : "asc") });
  return <>
    <p className="muted">Showing {orders.length ? (page - 1) * 5 + 1 : 0}–{Math.min(page * 5, total)} of {total} orders. Sorting and page number are saved in the URL.</p>
    {orders.length === 0 ? <section className="empty-state"><h2>No orders found</h2><p>There are no orders on this page.</p><Link className="button secondary" href="/orders">Return to the first page</Link></section> : <div className="table-scroll"><table className="data-table"><caption>Orders, sortable by order ID, date, neighbourhood, status or total</caption><thead><tr>
      <th scope="col"><Link href={sortLink("id")}>Order {sort === "id" ? (dir === "asc" ? "↑" : "↓") : "↕"}</Link></th>
      <th scope="col"><Link href={sortLink("date")}>Date {sort === "date" ? (dir === "asc" ? "↑" : "↓") : "↕"}</Link></th>
      <th scope="col"><Link href={sortLink("area")}>Area {sort === "area" ? (dir === "asc" ? "↑" : "↓") : "↕"}</Link></th>
      <th scope="col"><Link href={sortLink("status")}>Status {sort === "status" ? (dir === "asc" ? "↑" : "↓") : "↕"}</Link></th>
      <th scope="col" className="numeric"><Link href={sortLink("total")}>Total {sort === "total" ? (dir === "asc" ? "↑" : "↓") : "↕"}</Link></th>
    </tr></thead><tbody>{orders.map((order) => <tr key={order.id}><th scope="row">{order.id}</th><td>{order.date}</td><td>{order.area}</td><td><span className="status-pill">{order.status}</span></td><td className="numeric">{formatETB(order.total)}</td></tr>)}</tbody></table></div>}
    <nav className="pagination" aria-label="Order table pages">
      <Link aria-disabled={page <= 1} className={page <= 1 ? "page-link disabled" : "page-link"} href={queryHref({ page: Math.max(1, page - 1), sort, dir })}>← Previous</Link>
      <span>Page {page} of {pages}</span>
      <Link aria-disabled={page >= pages} className={page >= pages ? "page-link disabled" : "page-link"} href={queryHref({ page: Math.min(pages, page + 1), sort, dir })}>Next →</Link>
    </nav>
  </>;
}
