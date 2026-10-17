import { redirect } from "next/navigation";
import CheckoutForm from "./CheckoutForm";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout",
  description: "Complete your Addis Eats order securely.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const user = await getSession();

  if (!user) {
    redirect("/signin?next=/checkout");
  }

  return (
    <main className="container checkout-page">
      <div className="checkout-intro">
        <span className="eyebrow">FINAL STEP</span>
        <h1>Complete your order</h1>
        <p>
          Signed in as {user.name}. Your account name is used automatically—there is no name field to fill in. Add your phone number and delivery location so the courier can find you.
        </p>
      </div>
      <CheckoutForm />
    </main>
  );
}
