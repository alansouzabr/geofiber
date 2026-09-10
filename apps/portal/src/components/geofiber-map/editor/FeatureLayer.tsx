"use client";

import React from "react";
import { Marker, Popup } from "react-leaflet";
import { divIcon, type LatLng } from "leaflet";

import type { Feature } from "./types";

type Props = {
  features: Feature[];
  selectedId: string | null;
  moveId: string | null;
  onSelect: (id: string) => void;
  onRequestMove: (id: string) => void;
  onDelete: (id: string) => void;
  onDragEnd: (id: string, lat: number, lng: number) => void;
};

function isPointFeature(f: Feature): f is any {
  return typeof (f as any).lat === "number" && typeof (f as any).lng === "number";
}

const poleDotIcon = divIcon({
  className: "gf-pole-dot-icon",
  html: `
    <div style="
      width: 12px;
      height: 12px;
      border-radius: 999px;
      background: #a8a8a8;
      border: 2px solid #5f5f5f;
      box-sizing: border-box;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.35) inset;
    "></div>
  `,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
  popupAnchor: [0, -8],
});

export default function FeatureLayer({
  features,
  selectedId,
  moveId,
  onSelect,
  onRequestMove,
  onDelete,
  onDragEnd,
}: Props) {
  return (
    <>
      {features
        .filter((f) => f.visible !== false)
        .filter(isPointFeature)
        .map((f) => {
          const isMoving = moveId === f.id;
          const isSelected = selectedId === f.id;

          return (
            <Marker
              key={f.id}
              position={[f.lat, f.lng]}
              icon={f.type === "pole" ? poleDotIcon : undefined}
              draggable={isMoving}
              eventHandlers={{
                click: () => onSelect(f.id),
                dragend: (e) => {
                  const ll = (e.target as any).getLatLng() as LatLng;
                  onDragEnd(f.id, ll.lat, ll.lng);
                },
              }}
            >
              <Popup>
                <div style={{ minWidth: 220 }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>
                    {f.name || f.type} {isSelected ? "✅" : ""}
                  </div>

                  <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 10 }}>
                    Lat: {Number(f.lat).toFixed(6)} <br />
                    Lng: {Number(f.lng).toFixed(6)}
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        onRequestMove(f.id);
                      }}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 10,
                        border: "1px solid rgba(0,0,0,0.15)",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                      title="Clique para habilitar o arrastar/soltar do marcador"
                    >
                      {isMoving ? "Parar mover" : "Mover"}
                    </button>

                    <button
                      type="button"
                      onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        const ok = confirm("Excluir este item do mapa?");
                        if (ok) onDelete(f.id);
                      }}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 10,
                        border: "1px solid rgba(0,0,0,0.15)",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                      title="Remove do mapa"
                    >
                      Excluir
                    </button>
                  </div>

                  {isMoving ? (
                    <div style={{ marginTop: 10, fontSize: 12, opacity: 0.85 }}>
                      🔧 Modo mover ativo: arraste o marcador e solte para salvar.
                    </div>
                  ) : null}
                </div>
              </Popup>
            </Marker>
          );
        })}
    </>
  );
}