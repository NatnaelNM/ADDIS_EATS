import { getSession } from "@/lib/session";
import { getStoredOrder } from "@/lib/order-store";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const encoder = new TextEncoder();
export async function GET(_request, { params }) {
  const user = await getSession();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });
  const { id } = await params;
  const order = getStoredOrder(id);
  if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
  if (order.ownerId !== user.id && !["staff", "admin"].includes(user.role)) return Response.json({ error: "Not allowed" }, { status: 403 });
  let timer;
  const stream = new ReadableStream({ start(controller) { let ticks = 0; const send = () => { const current = getStoredOrder(id); if (!current) { controller.enqueue(encoder.encode(`event: error\ndata: {"error":"Order not found"}\n\n`)); clearInterval(timer); controller.close(); return; } const payload = { id: current.id, status: current.status, updatedAt: current.updatedAt || current.createdAt }; controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)); ticks += 1; if (ticks >= 60) { clearInterval(timer); controller.close(); } }; timer = setInterval(send, 5000); send(); }, cancel() { if (timer) clearInterval(timer); } });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive", "X-Accel-Buffering": "no" } });
}
