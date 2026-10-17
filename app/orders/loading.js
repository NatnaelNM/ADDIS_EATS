export default function OrdersLoading() {
  return <main className="container page-content"><div className="skeleton-title" /><p className="muted">Loading order records…</p><div className="table-skeleton" aria-label="Loading five order rows">{Array.from({ length: 5 }, (_, i) => <div className="table-skeleton-row" key={i}><span /><span /><span /><span /><span /></div>)}</div></main>;
}
