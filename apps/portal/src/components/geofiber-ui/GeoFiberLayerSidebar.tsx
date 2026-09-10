"use client";

import React from "react";
import {
  Cable,
  CircleDot,
  Boxes,
  Users,
  Package,
  Archive,
  Container,
  Workflow,
} from "lucide-react";

export type LayerKey =
  | "racks"
  | "postes"
  | "dutos"
  | "cabos"
  | "reservas"
  | "caixas"
  | "cto"
  | "clientes";

type LayerItem = {
  key: LayerKey;
  label: string;
  count: number;
};

type Props = {
  items: LayerItem[];
  visible: Record<LayerKey, boolean>;
  onToggle: (key: LayerKey) => void;
};

function iconFor(key: LayerKey) {
  const common = { size: 14, strokeWidth: 2 };
  if (key === "racks") return <Archive {...common} />;
  if (key === "postes") return <CircleDot {...common} />;
  if (key === "dutos") return <Workflow {...common} />;
  if (key === "cabos") return <Cable {...common} />;
  if (key === "reservas") return <Package {...common} />;
  if (key === "caixas") return <Boxes {...common} />;
  if (key === "cto") return <Container {...common} />;
  return <Users {...common} />;
}

export default function GeoFiberLayerSidebar({
  items,
  visible,
  onToggle,
}: Props) {
  return (
    <div
      style={{
        position: "absolute",
        top: 84,
        left: 4,
        zIndex: 4100,
        width: 312,
        borderRadius: 0,
        overflow: "hidden",
        borderRight: "1px solid rgba(0,0,0,0.14)",
        borderTop: "1px solid rgba(0,0,0,0.10)",
        borderBottom: "1px solid rgba(0,0,0,0.10)",
        background: "#bdbdbd",
        boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
      }}
    >
      <div
        style={{
          height: 20,
          display: "flex",
          alignItems: "center",
          padding: "0 8px",
          background: "linear-gradient(180deg,#b400a6,#8f008f)",
          color: "white",
          fontWeight: 700,
          fontSize: 11,
          borderBottom: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        Raiz
      </div>

      <div
        style={{
          padding: "8px 6px 6px 6px",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          background: "#c7c7c7",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            height: 26,
            borderRadius: 4,
            border: "1px solid rgba(0,0,0,0.10)",
            background: "#e0e0e0",
            padding: "0 8px",
            color: "#444",
            fontSize: 12,
          }}
        >
          <span style={{ fontSize: 13, lineHeight: 1 }}>⌕</span>
          <span style={{ opacity: 0.8 }}>Pesquisar...</span>
        </div>
      </div>

      <div
        style={{
          padding: 6,
          background: "#bdbdbd",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {items.map((item) => {
          const checked = visible[item.key];

          return (
            <label
              key={item.key}
              style={{
                minHeight: 28,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0 8px",
                borderRadius: 4,
                border: "1px solid #b4b4b4",
                background: "#d3d3d3",
                color: "#222",
                cursor: "pointer",
                fontSize: 12,
                boxSizing: "border-box",
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(item.key)}
                style={{
                  width: 13,
                  height: 13,
                  cursor: "pointer",
                  margin: 0,
                  flexShrink: 0,
                }}
              />

              <span
                style={{
                  width: 16,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#444",
                  flexShrink: 0,
                }}
              >
                {iconFor(item.key)}
              </span>

              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: 500,
                }}
              >
                {item.label}
              </span>

              <span
                style={{
                  fontSize: 11,
                  opacity: 0.78,
                  flexShrink: 0,
                }}
              >
                ({item.count})
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}