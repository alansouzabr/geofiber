"use client";

import React from "react";
import { TileLayer } from "react-leaflet";

export type BaseLayer = "osm" | "satellite";

type Props = {
  base: BaseLayer;
};

export default function MapLayers({ base }: Props) {
  return base === "osm" ? (
    <TileLayer
      attribution="© OpenStreetMap contributors"
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  ) : (
    <TileLayer
      attribution="Tiles © Esri"
      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    />
  );
}