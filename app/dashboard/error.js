"use client";
export default function DashboardError({ reset }) {
  return <main className="container page-content"><section className="error-state"><h1>Dashboard unavailable</h1><p>We couldn’t load the dashboard summary. Try again.</p><button className="button primary" onClick={() => reset()}>Try again</button></section></main>;
}
