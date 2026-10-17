import CategoryBar from "./CategoryBar";
import SearchBox from "./SearchBox";
import { dishes } from "@/lib/dishes";

export const revalidate = 3600;

export const metadata = {
  title: "Menu",
  description:
    "Browse Ethiopian dishes including Kitfo, Doro Wot, Tibs, Shiro, and vegetarian favorites.",
  alternates: { canonical: "/menu" },
  openGraph: {
    title: "Ethiopian Menu | Addis Eats",
    description: "Browse Ethiopian favorites from Addis Eats.",
    images: ["/menu/opengraph-image"],
  },
};

const pageSize = 4;
const categories = new Set([
  "All",
  "Main",
  "Stew",
  "Vegetarian",
  "Breakfast",
  "Starter",
  "Drink",
]);

export default async function MenuPage({ searchParams }) {
  const params = await searchParams;
  const requestedCategory = params?.category || "All";
  const activeCategory = categories.has(requestedCategory)
    ? requestedCategory
    : "All";
  const filteredDishes =
    activeCategory === "All"
      ? dishes
      : dishes.filter((dish) => dish.category === activeCategory);
  const initialPage = {
    items: filteredDishes.slice(0, pageSize),
    page: 1,
    pageSize,
    total: filteredDishes.length,
    totalPages: Math.max(1, Math.ceil(filteredDishes.length / pageSize)),
    query: "",
    category: activeCategory,
  };

  return (
    <main className="menu-content">
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADDIS EATS</span>
          <h1>Our menu</h1>
          <p>Traditional Ethiopian favorites, prepared for sharing.</p>
        </div>
        <span className="fresh-badge">12 Ethiopian favorites</span>
      </div>
      <CategoryBar activeCategory={activeCategory} />
      <SearchBox
        initialPage={initialPage}
        initialCategory={activeCategory}
      />
    </main>
  );
}
