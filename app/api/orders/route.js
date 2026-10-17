import { randomUUID } from "node:crypto";
import { getDishOrderLines } from "@/lib/dishes";
import { getSession } from "@/lib/session";
import { getStoredOrderRequest, saveStoredOrder } from "@/lib/order-store";
import { validateOrder } from "@/lib/schema";

export async function POST(request) {
  const user = await getSession();

  if (!user) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const customer = validateOrder({
    phone: body.phone,
    neighborhood: body.neighborhood,
    deliveryAddress: body.deliveryAddress,
    landmark: body.landmark,
    mapLocation: body.mapLocation,
  });

  if (!customer.success) {
    return Response.json(
      { error: "Validation failed", fieldErrors: customer.fieldErrors },
      { status: 422 },
    );
  }

  const requestId = String(body.requestId || "");

  if (!requestId || requestId.length > 120) {
    return Response.json(
      { error: "A valid requestId is required" },
      { status: 400 },
    );
  }

  const requestKey = `${user.id}:${requestId}`;
  const existingOrder = getStoredOrderRequest(requestKey);

  if (existingOrder) {
    return Response.json(
      {
        id: existingOrder.id,
        total: existingOrder.total,
        currency: "ETB",
      },
      { status: 200 },
    );
  }

  const orderLines = getDishOrderLines(body.items);

  if (!orderLines) {
    return Response.json(
      { error: "The cart is empty or contains invalid items" },
      { status: 422 },
    );
  }

  const now = new Date().toISOString();
  const order = {
    id: `ord_${randomUUID().replaceAll("-", "").slice(0, 12)}`,
    ownerId: user.id,
    customer: user.name,
    phone: customer.data.phone,
    area: customer.data.neighborhood,
    neighborhood: customer.data.neighborhood,
    deliveryAddress: customer.data.deliveryAddress,
    landmark: customer.data.landmark,
    mapLocation: customer.data.mapLocation,
    status: "Preparing",
    createdAt: now,
    updatedAt: now,
    date: now.slice(0, 10),
    items: orderLines.items,
    total: orderLines.total,
    currency: "ETB",
  };

  saveStoredOrder(order, requestKey);

  return Response.json(
    { id: order.id, total: order.total, currency: "ETB" },
    { status: 201 },
  );
}
