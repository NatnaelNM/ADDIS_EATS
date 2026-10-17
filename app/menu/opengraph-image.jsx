import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Ethiopian food menu at Addis Eats";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function MenuOpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px", background: "#F7F1E7", color: "#0A1F3D" }}>
      <div style={{ fontSize: 28, color: "#9B5D2E", marginBottom: 22 }}>ADDIS EATS · MENU</div>
      <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>A taste of Ethiopia</div>
      <div style={{ fontSize: 34, marginTop: 28 }}>Kitfo, Doro Wot, Tibs, Shiro and more</div>
      <div style={{ fontSize: 26, marginTop: 42, color: "#9B5D2E" }}>Made for sharing · Addis Ababa</div>
    </div>,
    { ...size }
  );
}
