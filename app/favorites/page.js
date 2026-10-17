import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { dishes } from "@/lib/dishes";
import FavoritesClient from "./FavoritesClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "My favorites", description: "Your saved Ethiopian dishes from Addis Eats." };

export default async function FavoritesPage() {
  const user = await getSession();
  if (!user) redirect("/signin?next=/favorites");
  if (user.role !== "customer") redirect(user.role === "admin" ? "/admin" : "/kitchen");
  return <main className="container page-content"><div className="page-heading"><div><span className="eyebrow">YOUR COLLECTION</span><h1>My favorites</h1><p>Your favorite Ethiopian dishes, saved for next time.</p></div></div><FavoritesClient dishes={dishes} /></main>;
}
