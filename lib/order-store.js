/**
 * Process-local order store for the classroom demo.
 * Replace with a database and unique idempotency keys for production.
 */
const storeKey = "__addisEatsOrders";
const idempotencyKey = "__addisEatsOrderRequests";

function getGlobalMap(key) {
  if (!globalThis[key]) {
    globalThis[key] = new Map();
  }

  return globalThis[key];
}

export function getStoredOrder(orderId) {
  return getGlobalMap(storeKey).get(orderId) || null;
}

export function getStoredOrderRequest(key) {
  return getGlobalMap(idempotencyKey).get(key) || null;
}

export function saveStoredOrder(order, requestKey) {
  getGlobalMap(storeKey).set(order.id, order);
  getGlobalMap(idempotencyKey).set(requestKey, order);
  return order;
}


export function listStoredOrders() {
  return [...getGlobalMap(storeKey).values()];
}

export function deleteStoredOrder(orderId) {
  const orders = getGlobalMap(storeKey);
  const order = orders.get(orderId);
  if (!order) return false;
  orders.delete(orderId);
  const requests = getGlobalMap(idempotencyKey);
  for (const [key, value] of requests.entries()) {
    if (value?.id === orderId) requests.delete(key);
  }
  return true;
}

export function clearStoredOrders() {
  getGlobalMap(storeKey).clear();
  getGlobalMap(idempotencyKey).clear();
}
