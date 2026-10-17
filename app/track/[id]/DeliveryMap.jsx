"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

const DELIVERY_POINTS = {
  restaurant: { position: [8.9806, 38.7578], label: "Addis Eats kitchen" },
  bole: { position: [8.995, 38.787], label: "Bole delivery area" },
  kazanchis: { position: [9.015, 38.766], label: "Kazanchis delivery area" },
  megenagna: { position: [9.030, 38.799], label: "Megenagna delivery area" },
};

function pointsFor(area) {
  const destination = DELIVERY_POINTS[area?.toLowerCase()] || DELIVERY_POINTS.bole;
  return [DELIVERY_POINTS.restaurant, destination];
}

export default function DeliveryMap({ area = "Bole" }) {
  const [mapReady, setMapReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const points = pointsFor(area);
  useEffect(() => {
    setMapReady(true);
    // Demo-only movement to make the delivery route feel live; no courier GPS is available.
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      setProgress(Math.min(0.92, ((Date.now() - startedAt) / (10 * 60 * 1000))));
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);
  const start = DELIVERY_POINTS.restaurant.position;
  const end = points[1].position;
  const courierPosition = [start[0] + (end[0] - start[0]) * progress, start[1] + (end[1] - start[1]) * progress];

  return (
    <section className="delivery-map-section" aria-labelledby="delivery-map-heading">
      <h2 id="delivery-map-heading">Delivery map</h2>
      <p>Approximate demo locations in Addis Ababa. The moving courier marker is simulated and does not represent live GPS tracking.</p>
      <div style={{ height: 360, width: "100%", overflow: "hidden", borderRadius: 14, background: "#f2f2f2" }}>
        {mapReady ? (
          <MapContainer center={[8.995, 38.775]} zoom={12} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {points.map((point) => (
              <CircleMarker key={point.label} center={point.position} radius={8} pathOptions={{ color: "#176b57", fillColor: "#2fa884", fillOpacity: 0.9 }}><Popup>{point.label}</Popup></CircleMarker>
            ))}
            <CircleMarker center={courierPosition} radius={7} pathOptions={{ color: "#8b4513", fillColor: "#f0a44b", fillOpacity: 1 }}><Popup>Simulated courier location</Popup></CircleMarker>
          </MapContainer>
        ) : <div style={{ padding: 20 }}>Loading map…</div>}
      </div>
      <ul>{points.map((point) => <li key={point.label}>{point.label}: {point.position[0].toFixed(4)}, {point.position[1].toFixed(4)}</li>)}<li>Simulated courier: {courierPosition[0].toFixed(4)}, {courierPosition[1].toFixed(4)}</li></ul>
    </section>
  );
}
