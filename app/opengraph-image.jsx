import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Addis Eats — Ethiopian food delivery in Addis Ababa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px", background: "#0A1F3D", color: "#FFFFFF" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "18px", fontSize: 30, color: "#F5C66A" }}>
        <div style={{ width: 58, height: 58, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 18, background: "#F5C66A", color: "#0A1F3D", fontWeight: 800 }}>AE</div>
        <span>Addis Eats</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontSize: 72, lineHeight: 1.08, fontWeight: 800 }}>Real Ethiopian food.</div>
        <div style={{ fontSize: 56, lineHeight: 1.1, color: "#F5C66A" }}>Made for sharing.</div>
        <div style={{ fontSize: 28, color: "#E1E8F0" }}>Ethiopian favorites delivered across Addis Ababa</div>
      </div>
      <div style={{ display: "flex", fontSize: 23, color: "#E1E8F0" }}>Doro Wot · Tibs · Kitfo · Shiro</div>
    </div>,
    { ...size }
  );
}
