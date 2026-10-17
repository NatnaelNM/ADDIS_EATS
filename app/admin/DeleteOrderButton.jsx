"use client";

import { useState, useTransition } from "react";
import { deleteOrder } from "../actions";

export default function DeleteOrderButton({ orderId }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  return <div>
    <button className="button secondary" type="button" disabled={pending} onClick={() => {
      if (!window.confirm(`Delete order ${orderId}? This cannot be undone.`)) return;
      setError("");
      startTransition(async () => {
        try { await deleteOrder(orderId); }
        catch { setError("Could not delete this order. Refresh and try again."); }
      });
    }}>{pending ? "Deleting…" : "Delete"}</button>
    {error ? <small role="alert" className="form-error">{error}</small> : null}
  </div>;
}
