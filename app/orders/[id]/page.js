import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getStoredOrder } from "@/lib/order-store";
import OrderStatus from "./OrderStatus";

export async function generateMetadata({ params }) {
  const { id } = await params;

  return {
    title: `Order ${id}`,
    description: "Private order status for your Addis Eats delivery.",
    robots: { index: false, follow: false },
  };
}

export default async function OrderPage({ params }) {
  const { id } = await params;
  const user = await getSession();

  if (!user) {
    redirect(`/signin?next=/orders/${encodeURIComponent(id)}`);
  }

  const storedOrder = getStoredOrder(id);
  const order = storedOrder
    ? {
        ...storedOrder,
        items: storedOrder.items.map(
          (item) => `${item.name} × ${item.quantity}`,
        ),
      }
    : null;

  if (!order) notFound();
  if (order.ownerId !== user.id && !["staff", "admin"].includes(user.role)) {
    notFound();
  }

  const { ownerId, ...initialOrder } = order;

  return (
    <main className="container page-content order-page">
      <span className="eyebrow">ORDER TRACKING</span>
      <h1>Your order</h1>
      <p>
        Signed in as {user.name}. The page loads the initial order on the server
        and refreshes its status in the browser.
      </p>
      <OrderStatus id={id} initial={initialOrder} />
      <Link className="back-link" href="/menu">
        ← Back to menu
      </Link>
    </main>
  );
}
