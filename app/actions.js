"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDishOrderLines } from "@/lib/dishes";
import {
  deleteStoredOrder,
  clearStoredOrders,
  getStoredOrder,
  getStoredOrderRequest,
  saveStoredOrder,
} from "@/lib/order-store";
import { validateOrder } from "@/lib/schema";
import { clearSession, getSession, setSession } from "@/lib/session";
import { verifyCredentials } from "@/lib/users";

export async function signIn(_previousState, formData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const user = verifyCredentials(email, password);

  if (!user) {
    return { error: "Email or password is incorrect." };
  }

  await setSession(user);

  const requested = user.role === "admin" ? "/admin" : String(formData.get("next") || "/");
  const isLocalPath =
    requested.startsWith("/") &&
    !requested.startsWith("//") &&
    !requested.includes("\\");
  const next = isLocalPath ? requested : "/";

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signOut() {
  await clearSession();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function placeOrder(_previousState, formData) {
  const user = await getSession();

  if (!user) {
    return { error: "Please sign in before placing an order." };
  }

  const customer = validateOrder({
    phone: formData.get("phone"),
    neighborhood: formData.get("neighborhood"),
    deliveryAddress: formData.get("deliveryAddress"),
    landmark: formData.get("landmark"),
    mapLocation: formData.get("mapLocation"),
  });

  if (!customer.success) {
    return { fieldErrors: customer.fieldErrors };
  }

  const requestId = String(formData.get("requestId") || "");

  if (!requestId || requestId.length > 120) {
    return { error: "Refresh the checkout page and try again." };
  }

  const idempotencyKey = `${user.id}:${requestId}`;
  const existingOrder = getStoredOrderRequest(idempotencyKey);

  if (existingOrder) {
    return {
      id: existingOrder.id,
      total: existingOrder.total,
      message: `Order already received for ${user.name}.`,
    };
  }

  let submittedItems;

  try {
    submittedItems = JSON.parse(String(formData.get("items") || "[]"));
  } catch {
    return {
      error: "Your cart could not be read. Please review it and try again.",
    };
  }

  const orderLines = getDishOrderLines(submittedItems);

  if (!orderLines) {
    return {
      error: "Your cart is empty or contains an invalid item. Please review it.",
    };
  }

  const now = new Date().toISOString();
  const order = {
    id: `ord_${randomUUID().replaceAll("-", "").slice(0, 12)}`,
    ownerId: user.id,
    customer: user.name,
    phone: customer.data.phone,
    status: "Preparing",
    area: customer.data.neighborhood,
    neighborhood: customer.data.neighborhood,
    deliveryAddress: customer.data.deliveryAddress,
    landmark: customer.data.landmark,
    mapLocation: customer.data.mapLocation,
    date: now.slice(0, 10),
    createdAt: now,
    updatedAt: now,
    items: orderLines.items,
    total: orderLines.total,
    currency: "ETB",
  };

  saveStoredOrder(order, idempotencyKey);
  revalidatePath("/checkout");
  revalidatePath("/orders");

  return {
    id: order.id,
    total: order.total,
    message: `Order received for ${user.name}.`,
  };
}

export async function cancelOrder(orderId) {
  const user = await getSession();

  if (!user) {
    throw new Error("Not signed in (401)");
  }

  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const storedOrder = getStoredOrder(orderId);
  const order = storedOrder ? { id: storedOrder.id, userId: storedOrder.ownerId } : null;

  if (!order) {
    throw new Error("No such order (404)");
  }

  if (order.userId !== user.id && !["staff", "admin"].includes(user.role)) {
    throw new Error("Not yours (403)");
  }
  if (!["Preparing"].includes(storedOrder.status)) {
    throw new Error("This order can no longer be cancelled.");
  }
  // Only the owner or authorized staff/admin may cancel a not-yet-dispatched order.
  storedOrder.status = "Cancelled";
  storedOrder.updatedAt = new Date().toISOString();
  revalidatePath("/orders");
  revalidatePath(`/orders/${encodeURIComponent(orderId)}`);
  revalidatePath(`/track/${encodeURIComponent(orderId)}`);
  revalidatePath("/admin");
  revalidatePath("/kitchen");
  return { cancelled: true };
}


export async function deleteOrder(orderId) {
  const user = await getSession();
  if (!user || user.role !== "admin") {
    throw new Error("Admin access required.");
  }
  if (typeof orderId !== "string" || !/^ord_[a-zA-Z0-9_-]{3,80}$/.test(orderId)) {
    throw new Error("Invalid order ID.");
  }
  deleteStoredOrder(orderId);
  revalidatePath("/admin");
  revalidatePath("/orders");
  revalidatePath("/dashboard");
  return { deleted: true };
}

export async function deleteAllOrders() {
  const user = await getSession();
  if (!user || user.role !== "admin") throw new Error("Admin access required.");
  clearStoredOrders();
  revalidatePath("/admin");
  revalidatePath("/orders");
  revalidatePath("/dashboard");
  revalidatePath("/kitchen");
  return { deleted: true };
}
