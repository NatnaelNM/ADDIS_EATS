"use client";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function OrdersLineChart({ data }) {
  if (!data.length) return <p className="empty-state">No order activity is available for this range.</p>;
  return <div className="chart-frame" role="img" aria-label="Line chart showing the number of orders per day. A data table follows the chart.">
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 12, right: 20, left: 4, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: "#596458", fontSize: 12 }} />
        <YAxis allowDecimals={false} width={34} tick={{ fill: "#596458", fontSize: 12 }} />
        <Tooltip formatter={(value) => [value, "Orders"]} />
        <Line type="monotone" dataKey="orders" name="Orders" stroke="#29482e" strokeWidth={3} dot={{ r: 4, fill: "#426b45" }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>;
}
