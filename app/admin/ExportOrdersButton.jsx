"use client";

import { downloadCsv } from "@/lib/csv";

const columns = ["Order ID", "Date", "Customer", "Phone", "Area", "Delivery Address", "Landmark", "Map Location", "Status", "Total (ETB)", "Items"];

export default function ExportOrdersButton({ orders }) {
  function exportOrders() {
    const rows = [columns, ...orders.map((order) => [
      order.id, order.date || order.createdAt, order.customer, order.phone,
      order.neighborhood || order.area, order.deliveryAddress, order.landmark,
      order.mapLocation, order.status, order.total,
      (order.items || []).map((item) => `${item.name} x ${item.quantity}`).join("; "),
    ])];
    downloadCsv(`addis-eats-orders-${new Date().toISOString().slice(0, 10)}.csv`, rows);
  }

  return <button className="button secondary" type="button" onClick={exportOrders} disabled={!orders.length}>Download CSV report</button>;
}
