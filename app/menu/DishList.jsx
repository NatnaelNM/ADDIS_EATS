import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/app/cart/AddToCartButton";
import FavoriteButton from "./FavoriteButton";
import { formatETB } from "@/lib/format";

export default function DishList({ dishes }) {
  return (
    <div className="dish-grid">
      {dishes.map((dish) => (
        <article className="dish-card" key={dish.id}>
          <div className="dish-image">
            <Image
              src={dish.image}
              alt={`Traditional Ethiopian ${dish.name}`}
              width={600}
              height={400}
              sizes="(max-width: 760px) 100vw, (max-width: 1120px) 50vw, 540px"
              className="dish-photo"
            />
          </div>
          <div className="dish-body">
            <div className="dish-top">
              <h2>{dish.name}</h2>
              <span>{formatETB(dish.price)}</span>
            </div>
            <span className="tag">{dish.category}</span>
            <p>{dish.description}</p>
            <div className="dish-actions">
              <Link href={`/menu/${dish.id}`}>View dish</Link>
              <FavoriteButton dish={dish} compact />
              <AddToCartButton
                dish={dish}
                className="button primary small-button"
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
