import { getSession } from "@/lib/session";
import { getStoredOrder } from "@/lib/order-store";

export async function GET(_request, { params }) {
  const user = await getSession();

  if (!user) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  const { id } = await params;
  const storedOrder = getStoredOrder(id);
  const order = storedOrder
    ? {
        ...storedOrder,
        items: storedOrder.items.map(
          (item) => `${item.name} × ${item.quantity}`,
        ),
      }
    : null;

  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.ownerId !== user.id && !["staff", "admin"].includes(user.role)) {
    return Response.json({ error: "Not allowed" }, { status: 403 });
  }

  const { ownerId, phone, ...visibleOrder } = order;

  return Response.json({
    ...visibleOrder,
    updatedAt: new Date().toISOString(),
  });
}


export async function PATCH(request, { params }) {
  const user = await getSession();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });
  if (user.role !== "admin") return Response.json({ error: "Admin access required" }, { status: 403 });

  let body;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid JSON body" }, { status: 400 }); }

  const allowedStatuses = new Set(["Preparing", "On the way", "Delivered"]);
  if (!allowedStatuses.has(body?.status)) return Response.json({ error: "Invalid order status" }, { status: 422 });

  const { id } = await params;
  const order = getStoredOrder(id);
  if (!order) return Response.json({ error: "Order not found" }, { status: 404 });

  order.status = body.status;
  order.updatedAt = new Date().toISOString();
  return Response.json({ id: order.id, status: order.status, updatedAt: order.updatedAt });
}
