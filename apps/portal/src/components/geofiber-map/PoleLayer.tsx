"use client";

import { Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { usePoles } from "@/modules/poles/usePoles";
import { useTool } from "@/modules/tools/useTool";

// 🔥 ÍCONE BOLINHA CINZA (GeoGrid style)
const poleIcon = new L.DivIcon({
  html: `<div style="
    width:12px;
    height:12px;
    background:#9ca3af;
    border-radius:50%;
    border:2px solid #1f2937;
  "></div>`,
  iconSize: [12, 12],
});

export default function PoleLayer() {
  const { poles, addPole } = usePoles();
  const { activeTool } = useTool();

  useMapEvents({
    click(e) {
      if (activeTool === "pole") {
        addPole(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return (
    <>
      {poles.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={poleIcon}
        />
      ))}
    </>
  );
}
