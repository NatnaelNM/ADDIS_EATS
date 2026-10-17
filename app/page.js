import Image from "next/image";
import Link from "next/link";
import { dishes } from "@/lib/dishes";
import { formatETB } from "@/lib/format";
import AddToCartButton from "@/app/cart/AddToCartButton";

export const metadata = {
  title: "Ethiopian food delivery in Addis Ababa",
  description:
    "Discover Doro Wot, Tibs, Kitfo, Shiro, and traditional vegetarian Ethiopian dishes from Addis Eats.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const featuredDishes = [
    dishes.find((dish) => dish.id === "doro"),
    dishes.find((dish) => dish.id === "tibs"),
    dishes.find((dish) => dish.id === "beyaynet"),
  ].filter(Boolean);

  const restaurantJsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Addis Eats",
    url: `${(process.env.NEXT_PUBLIC_SITE_URL || "https://addiseats.et").replace(/\/$/, "")}/`,
    servesCuisine: "Ethiopian",
    priceRange: "90–520 ETB",
    hasMenu: {
      "@type": "Menu",
      name: "Addis Eats Menu",
      hasMenuItem: dishes.map((dish) => ({
        "@type": "MenuItem",
        name: dish.name,
        description: dish.description,
        offers: {
          "@type": "Offer",
          price: dish.price,
          priceCurrency: "ETB",
        },
      })),
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(restaurantJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">A TASTE OF ETHIOPIA</span>
            <h1>
              Real Ethiopian food.
              <br />
              <em>Made for sharing.</em>
            </h1>
            <p>
              From spicy Doro Wot to a colorful fasting platter, discover
              familiar Addis favorites with a simple ordering experience.
            </p>
            <div className="hero-actions">
              <Link className="button primary" href="/menu">
                Explore menu
              </Link>
              <Link className="button secondary" href="/cart">
                View cart
              </Link>
            </div>
            <div className="hero-points">
              <span>✓ Ethiopian favorites</span>
              <span>✓ Prices in ETB</span>
              <span>✓ Easy cart updates</span>
            </div>
          </div>

          <div className="hero-card">
            <Image
              src={dishes.find((dish) => dish.id === "beyaynet")?.image}
              alt="Traditional Ethiopian beyaynetu vegetarian platter served on injera"
              width={720}
              height={600}
              sizes="(max-width: 760px) 100vw, 45vw"
              priority
              className="hero-photo"
            />
            <span>Fresh favorites</span>
            <strong>Made for the table</strong>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">POPULAR DISHES</span>
            <h2>Start with a favorite</h2>
            <p>Choose a dish and add it to your cart whenever you are ready.</p>
          </div>
          <Link href="/menu">See the full menu →</Link>
        </div>

        <div className="dish-grid">
          {featuredDishes.map((dish) => (
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
                  <AddToCartButton
                    dish={dish}
                    className="button primary small-button"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
