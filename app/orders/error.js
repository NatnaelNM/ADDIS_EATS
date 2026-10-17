"use client";
export default function OrdersError({ reset }) {
  return <main className="container page-content"><section className="error-state"><h1>We couldn’t load the orders</h1><p>Something went wrong while preparing the order table. Please try again.</p><button className="button primary" onClick={() => reset()}>Try again</button></section></main>;
}
