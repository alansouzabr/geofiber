"use client";

import React, { useState } from "react";
import { ChevronDown, Search, Minus, Plus } from "lucide-react";

export default function GeoFiberRightPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState("Execução");
  const [mapType, setMapType] = useState("Mapa normal");

  return (
    <div
      style={{
        position: "absolute",
        top: 106,
        right: 14,
        zIndex: 4150,
        width: 290,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={topRow}>
        <button type="button" style={selectBtn} onClick={() => setMode(mode === "Execução" ? "Viabilidade" : "Execução")}>
          <span>{mode}</span>
          <ChevronDown size={16} />
        </button>

        <button type="button" style={selectBtn} onClick={() => setMapType(mapType === "Mapa normal" ? "Satélite" : "Mapa normal")}>
          <span>{mapType}</span>
          <ChevronDown size={16} />
        </button>
      </div>

      <div style={panel}>
        <div style={panelHead}>
          <div style={panelTitle}>Painel operacional</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button type="button" style={tinyBtn} onClick={() => setCollapsed(true)} title="Minimizar">
              <Minus size={14} />
            </button>
            <button type="button" style={tinyBtn} onClick={() => setCollapsed(false)} title="Restaurar">
              <Plus size={14} />
            </button>
          </div>
        </div>

        {!collapsed ? (
          <>
            <div style={searchWrap}>
              <Search size={16} />
              <input
                placeholder="Busca via OpenStreetMap (Nominatim)"
                style={searchInput}
              />
            </div>

            <div style={{ marginTop: 12, fontSize: 12, opacity: 0.85, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={rowItem}>• modo: {mode}</div>
              <div style={rowItem}>• visualização: {mapType}</div>
              <div style={rowItem}>• viabilidade</div>
              <div style={rowItem}>• execução</div>
              <div style={rowItem}>• filtros operacionais</div>
              <div style={rowItem}>• camadas</div>
            </div>
          </>
        ) : (
          <div style={{ fontSize: 12, opacity: 0.8 }}>Painel recolhido.</div>
        )}
      </div>
    </div>
  );
}

const topRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
};

const selectBtn: React.CSSProperties = {
  height: 40,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.92)",
  color: "#1f1f1f",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 12px",
  fontWeight: 800,
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
};

const panel: React.CSSProperties = {
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(34,34,38,0.74)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 16px 40px rgba(0,0,0,0.28)",
  color: "white",
  padding: 12,
};

const panelHead: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 10,
};

const panelTitle: React.CSSProperties = {
  fontWeight: 900,
};

const searchWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  height: 36,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.06)",
  padding: "0 10px",
};

const searchInput: React.CSSProperties = {
  width: "100%",
  border: "none",
  outline: "none",
  background: "transparent",
  color: "white",
};

const rowItem: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 8,
  background: "rgba(255,255,255,0.05)",
};

const tinyBtn: React.CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: 6,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(0,0,0,0.18)",
  color: "white",
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
  padding: 0,
};