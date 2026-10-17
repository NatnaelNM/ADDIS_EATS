import Link from "next/link";

const categories = [
  "All",
  "Main",
  "Stew",
  "Vegetarian",
  "Breakfast",
  "Starter",
  "Drink",
];

export default function CategoryBar({ activeCategory = "All" }) {
  return (
    <nav className="category-bar" aria-label="Filter menu by category">
      {categories.map((category) => {
        const href =
          category === "All"
            ? "/menu"
            : `/menu?category=${encodeURIComponent(category)}`;

        return (
          <Link
            key={category}
            className={
              activeCategory === category ? "category active" : "category"
            }
            href={href}
            aria-current={activeCategory === category ? "page" : undefined}
          >
            {category}
          </Link>
        );
      })}
    </nav>
  );
}
