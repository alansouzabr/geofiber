"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import MapBinder from "./MapBinder";

export default function GeoFiberMapClient() {
  return (
    <MapContainer
      center={[-23.55, -46.63]}
      zoom={13}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 🔥 NOSSO SISTEMA DE POSTES */}
      <MapBinder />

    </MapContainer>
  );
}
