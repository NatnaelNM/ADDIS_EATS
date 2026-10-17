"use client";
import { useState, useTransition } from "react";
import { deleteAllOrders } from "../actions";
export default function ClearOrdersButton() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  return <div>
    <button className="button danger" type="button" disabled={pending} onClick={() => {
      if (!window.confirm("Delete ALL orders? This cannot be undone.")) return;
      setError("");
      startTransition(async () => { try { await deleteAllOrders(); } catch { setError("Could not clear orders. Refresh and try again."); } });
    }}>{pending ? "Deleting…" : "Delete all orders"}</button>
    {error ? <small role="alert" className="form-error">{error}</small> : null}
  </div>;
}
