"use client";

import React, { useMemo, useState } from "react";
import { Search, Minus, Plus, FolderOpen } from "lucide-react";
import type { Feature } from "@/components/geofiber-map/editor/types";

type Props = {
  features: Feature[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function labelOf(f: any) {
  return f?.name || f?.type || "Item";
}

export default function GeoFiberObjectsPanel({
  features,
  selectedId,
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return features;
    return features.filter((f: any) =>
      `${f?.name || ""} ${f?.type || ""}`.toLowerCase().includes(q)
    );
  }, [features, query]);

  return (
    <div
      style={{
        position: "absolute",
        top: 106,
        left: 88,
        zIndex: 4150,
        width: collapsed ? 240 : 310,
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(34,34,38,0.74)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.30)",
        color: "white",
        transition: "width .18s ease",
      }}
    >
      <div
        style={{
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 10px",
          background: "linear-gradient(90deg,var(--gf-primary,#8f008f),var(--gf-secondary,#a90097))",
          fontWeight: 900,
          fontSize: 14,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FolderOpen size={16} />
          Objetos ({features.length})
        </span>

        <div style={{ display: "flex", gap: 6 }}>
          <button type="button" style={tinyBtn} title="Minimizar" onClick={() => setCollapsed(true)}>
            <Minus size={14} />
          </button>
          <button type="button" style={tinyBtn} title="Restaurar" onClick={() => setCollapsed(false)}>
            <Plus size={14} />
          </button>
        </div>
      </div>

      {!collapsed ? (
        <div style={{ padding: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              height: 36,
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.06)",
              padding: "0 10px",
              marginBottom: 10,
            }}
          >
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar item"
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                color: "white",
              }}
            />
          </div>

          <div
            style={{
              maxHeight: 380,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              paddingRight: 2,
            }}
          >
            {visible.length === 0 ? (
              <div style={{ opacity: 0.75, fontSize: 13 }}>Nenhum item encontrado.</div>
            ) : (
              visible.map((f: any) => {
                const active = selectedId === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onSelect(f.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      minHeight: 38,
                      borderRadius: 10,
                      border: active
                        ? "1px solid rgba(255,255,255,0.28)"
                        : "1px solid rgba(255,255,255,0.08)",
                      background: active
                        ? "rgba(255,255,255,0.14)"
                        : "rgba(255,255,255,0.05)",
                      color: "white",
                      cursor: "pointer",
                      padding: "0 10px",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        background: active ? "var(--gf-accent,#28d7ff)" : "rgba(255,255,255,0.35)",
                        boxShadow: active ? "0 0 10px var(--gf-accent,#28d7ff)" : "none",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {labelOf(f)}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div style={{ padding: 10, fontSize: 12, opacity: 0.8 }}>
          Painel recolhido.
        </div>
      )}
    </div>
  );
}

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