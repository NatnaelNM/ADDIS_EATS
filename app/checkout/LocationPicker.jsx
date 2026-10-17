"use client";

import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ADDIS_CENTER = [9.0192, 38.7525];
const deliveryPin = L.divIcon({
  className: "addis-delivery-pin",
  html: '<span style="display:block;width:20px;height:20px;background:#b93b2f;border:3px solid #fff;border-radius:50%;box-shadow:0 1px 6px #333"></span>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function MapClickHandler({ onPick }) {
  useMapEvents({
    click(event) {
      onPick([event.latlng.lat, event.latlng.lng]);
    },
  });
  return null;
}

export default function LocationPicker() {
  const [position, setPosition] = useState(null);
  const locationValue = useMemo(
    () => position ? `${position[0].toFixed(6)}, ${position[1].toFixed(6)}` : "",
    [position],
  );

  return (
    <section className="form-row delivery-location-picker" aria-labelledby="location-picker-title">
      <label id="location-picker-title">Pin your exact delivery location (optional)</label>
      <p className="field-help">Click or tap the map to drop a pin. The neighborhood selector and written directions are required even if you use the map.</p>
      <div className="location-map-frame">
        <MapContainer
          center={ADDIS_CENTER}
          zoom={12}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          aria-label="Map to select delivery location"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onPick={setPosition} />
          {position ? <Marker position={position} icon={deliveryPin} /> : null}
        </MapContainer>
      </div>
      <input type="hidden" name="mapLocation" value={locationValue} />
      {position ? (
        <p className="location-selected" role="status">Delivery pin selected: {locationValue}</p>
      ) : (
        <p className="field-help">No pin selected. You can still place your order using the neighborhood and directions.</p>
      )}
      <button type="button" className="button secondary location-clear" onClick={() => setPosition(null)} disabled={!position}>Clear map pin</button>
    </section>
  );
}
