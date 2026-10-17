"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatETB } from "@/lib/format";

export default function RevenueChart({ data }) {
  if (!data.length) return <p className="empty-state">No revenue data is available yet.</p>;
  return <div className="chart-frame" role="img" aria-label="Bar chart showing total revenue in Ethiopian birr by neighbourhood. A data table follows the chart.">
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 12, right: 18, left: 14, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="area" tick={{ fill: "#596458", fontSize: 12 }} />
        <YAxis width={86} tickFormatter={formatETB} tick={{ fill: "#596458", fontSize: 11 }} />
        <Tooltip formatter={(value) => [formatETB(Number(value)), "Revenue"]} />
        <Bar dataKey="revenue" name="Revenue" fill="#426b45" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>;
}
