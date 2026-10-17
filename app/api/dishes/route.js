import { dishes } from "@/lib/dishes";

const PAGE_SIZE = 4;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const category = (searchParams.get("category") || "All").trim();
  const requestedPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const page = Number.isFinite(requestedPage)
    ? Math.max(1, requestedPage)
    : 1;

  const filtered = dishes.filter((dish) => {
    const matchesQuery = `${dish.name} ${dish.category} ${dish.description}`
      .toLowerCase()
      .includes(query);
    const matchesCategory = category === "All" || dish.category === category;

    return matchesQuery && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

  return Response.json({
    items,
    page: safePage,
    pageSize: PAGE_SIZE,
    total: filtered.length,
    totalPages,
    query,
    category,
  });
}
