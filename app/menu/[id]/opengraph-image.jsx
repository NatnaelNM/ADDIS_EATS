import { ImageResponse } from "next/og";
import { getDish } from "@/lib/dishes";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function DishOpenGraphImage({ params }) {
  const { id } = await params;
  const dish = getDish(id);
  const name = dish?.name || "Dish not found";
  const price = dish ? `${dish.price} ETB` : "Addis Eats menu";
  const description = dish?.description || "Explore Ethiopian favorites from Addis Eats";
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "68px", background: "#0A1F3D", color: "#FFFFFF" }}>
      <div style={{ fontSize: 28, color: "#F5C66A" }}>ADDIS EATS · ETHIOPIAN FAVORITES</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 82, fontWeight: 800, lineHeight: 1.05 }}>{name}</div>
        <div style={{ fontSize: 36, color: "#F5C66A" }}>{price}</div>
        <div style={{ fontSize: 28, color: "#E1E8F0", maxWidth: "980px" }}>{description}</div>
      </div>
      <div style={{ fontSize: 25, color: "#E1E8F0" }}>Ethiopian food delivered across Addis Ababa</div>
    </div>,
    { ...size }
  );
}
