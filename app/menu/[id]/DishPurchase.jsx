import AddToCartButton from "@/app/cart/AddToCartButton";
import FavoriteButton from "@/app/menu/FavoriteButton";

export default function DishPurchase({ dish }) {
  return (
    <div className="detail-actions">
      <AddToCartButton dish={dish} />
      <FavoriteButton dish={dish} />
      <a className="back-link" href="/menu">
        ← Back to menu
      </a>
    </div>
  );
}
