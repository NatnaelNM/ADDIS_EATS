import CartClient from "./CartClient";

export const metadata = {
  title: "Your cart",
  description: "Review your Addis Eats order before continuing to checkout.",
  alternates: { canonical: "/cart" },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartClient />;
}
