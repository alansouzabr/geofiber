"use client";

import React, { useMemo, useRef, useState } from "react";
import { MapPin, Network, Box, User, StickyNote, Move, Trash2, Plus, Search } from "lucide-react";

import GeoGridDock from "./GeoGridDock";
import FloatingPanel from "./FloatingPanel";
import type { Feature } from "@/components/geofiber-map/editor/types";
import type { Map as LeafletMap } from "leaflet";

type DockKey = "postes" | "cto" | "caixa" | "cliente" | "nota";

type Props = {
  features: Feature[];
  selectedId: string | null;
  moveId: string | null;

  map: LeafletMap | null;

  onSelect: (id: string) => void;
  onRequestMove: (id: string) => void;
  onDelete: (id: string) => void;

  onAdd: (kind: DockKey) => void;
};

function isPointFeature(f: Feature): f is any {
  return typeof (f as any).lat === "number" && typeof (f as any).lng === "number";
}

function featureKindToDock(type: string): DockKey | null {
  if (type === "pole") return "postes";
  if (type === "cto") return "cto";
  if (type === "splice_box") return "caixa";
  if (type === "customer") return "cliente";
  if (type === "note") return "nota";
  return null;
}

type PanelState = {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  locked: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
};

const Z_START = 2500;

export default function GeoGridOverlay({
  features,
  selectedId,
  moveId,
  map,
  onSelect,
  onRequestMove,
  onDelete,
  onAdd,
}: Props) {
  const zRef = useRef(Z_START);

  const [panels, setPanels] = useState<Record<DockKey, PanelState>>({
    postes: { open: true, minimized: false, maximized: false, locked: false, x: 80, y: 120, w: 420, h: 520, z: Z_START + 1 },
    cto:     { open: false, minimized: false, maximized: false, locked: false, x: 520, y: 140, w: 420, h: 520, z: Z_START + 2 },
    caixa:   { open: false, minimized: false, maximized: false, locked: false, x: 940, y: 160, w: 420, h: 520, z: Z_START + 3 },
    cliente: { open: false, minimized: false, maximized: false, locked: false, x: 520, y: 520, w: 420, h: 520, z: Z_START + 4 },
    nota:    { open: false, minimized: false, maximized: false, locked: false, x: 80, y: 560, w: 420, h: 520, z: Z_START + 5 },
  });

  const [q, setQ] = useState<Record<DockKey, string>>({
    postes: "",
    cto: "",
    caixa: "",
    cliente: "",
    nota: "",
  });

  const byDock = useMemo(() => {
    const base: Record<DockKey, any[]> = { postes: [], cto: [], caixa: [], cliente: [], nota: [] };
    for (const f of features) {
      if (!isPointFeature(f)) continue;
      const dk = featureKindToDock((f as any).type);
      if (!dk) continue;
      base[dk].push(f);
    }
    for (const k of Object.keys(base) as DockKey[]) {
      base[k].sort((a, b) => String(a.name ?? "").localeCompare(String(b.name ?? "")));
    }
    return base;
  }, [features]);

  function focusPanel(k: DockKey) {
    setPanels((p) => {
      const z = ++zRef.current;
      return { ...p, [k]: { ...p[k], z } };
    });
  }

  function toggleDock(k: DockKey) {
    setPanels((p) => {
      const cur = p[k];
      const z = ++zRef.current;
      if (!cur.open) return { ...p, [k]: { ...cur, open: true, minimized: false, z } };
      if (cur.minimized) return { ...p, [k]: { ...cur, minimized: false, z } };
      return { ...p, [k]: { ...cur, open: false, minimized: false, maximized: false } };
    });
  }

  function closePanel(k: DockKey) {
    setPanels((p) => ({ ...p, [k]: { ...p[k], open: false, minimized: false, maximized: false } }));
  }

  function minimizeToBar(k: DockKey) {
    setPanels((p) => ({ ...p, [k]: { ...p[k], minimized: true, maximized: false } }));
  }

  function restoreFromBar(k: DockKey) {
    setPanels((p) => {
      const z = ++zRef.current;
      return { ...p, [k]: { ...p[k], open: true, minimized: false, z } };
    });
  }

  function toggleMax(k: DockKey) {
    setPanels((p) => ({ ...p, [k]: { ...p[k], maximized: !p[k].maximized, minimized: false } }));
  }

  function toggleLock(k: DockKey) {
    setPanels((p) => ({ ...p, [k]: { ...p[k], locked: !p[k].locked } }));
  }

  function movePanel(k: DockKey, x: number, y: number) {
    setPanels((p) => ({ ...p, [k]: { ...p[k], x, y } }));
  }

  function filtered(k: DockKey) {
    const needle = (q[k] || "").trim().toLowerCase();
    const list = byDock[k] || [];
    if (!needle) return list;
    return list.filter((f: any) => {
      const txt = `${f.name ?? ""} ${f.type ?? ""} ${f.notes ?? ""}`.toLowerCase();
      return txt.includes(needle);
    });
  }

  function onPickItem(f: any) {
    onSelect(f.id);
    if (map && typeof f.lat === "number" && typeof f.lng === "number") {
      const cur = typeof (map as any).getZoom === "function" ? (map as any).getZoom() : 16;
      const zoom = Math.max(cur, 18);
      map.setView([f.lat, f.lng], zoom, { animate: true });
    }
  }

  const Panel = (dk: DockKey, baseTitle: string, icon: React.ReactNode) => {
    const st = panels[dk];
    if (!st.open) return null;

    const list = filtered(dk);
    const total = (byDock[dk] || []).length;
    const title = `${baseTitle} (${total})`;

    return (
      <FloatingPanel
        id={dk}
        title={title}
        icon={icon}
        x={st.x}
        y={st.y}
        w={st.w}
        h={st.h}
        z={st.z}
        locked={st.locked}
        maximized={st.maximized}
        minimized={st.minimized}
        onFocus={() => focusPanel(dk)}
        onMove={(_, x, y) => movePanel(dk, x, y)}
        onToggleMinimize={() => minimizeToBar(dk)}
        onToggleMaximize={() => toggleMax(dk)}
        onToggleLock={() => toggleLock(dk)}
        onClose={() => closePanel(dk)}
      >
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button
            type="button"
            onClick={() => onAdd(dk)}
            style={{ ...btnStyle, display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}
            title="Adicionar no mapa"
          >
            <Plus size={16} />
            Adicionar
          </button>

          <div style={searchWrapStyle}>
            <Search size={16} style={{ opacity: 0.8 }} />
            <input
              value={q[dk]}
              onChange={(e) => setQ((p) => ({ ...p, [dk]: e.target.value }))}
              placeholder="Buscar..."
              style={searchInputStyle}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {list.length === 0 ? (
            <div style={{ ...hintStyle, marginTop: 6 }}>Nenhum item encontrado.</div>
          ) : (
            list.map((f: any) => {
              const active = selectedId === f.id;
              const moving = moveId === f.id;

              return (
                <div
                  key={f.id}
                  style={{
                    borderRadius: 12,
                    border: active ? "1px solid rgba(177,0,255,0.75)" : "1px solid rgba(255,255,255,0.12)",
                    background: active ? "rgba(177,0,255,0.16)" : "rgba(0,0,0,0.20)",
                    padding: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    cursor: "pointer",
                  }}
                  onClick={() => onPickItem(f)}
                  title="Selecionar e centralizar no mapa"
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 900,
                        fontSize: 13,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {f.name || "(sem nome)"}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
                      {f.type} • {Number(f.lat).toFixed(6)}, {Number(f.lng).toFixed(6)}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequestMove(f.id);
                      }}
                      title={moving ? "Cancelar mover" : "Mover (arrastar no mapa)"}
                      style={{
                        width: 36,
                        height: 34,
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: moving ? "rgba(177,0,255,0.28)" : "rgba(0,0,0,0.15)",
                        color: "white",
                        cursor: "pointer",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <Move size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Excluir este item?")) onDelete(f.id);
                      }}
                      title="Excluir"
                      style={{
                        width: 36,
                        height: 34,
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(255,0,70,0.16)",
                        color: "white",
                        cursor: "pointer",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{ ...hintStyle, marginTop: 10 }}>
          Dica: clique em <b>Mover</b> e depois arraste o marcador no mapa.
        </div>
      </FloatingPanel>
    );
  };

  const minimizedKeys = (Object.keys(panels) as DockKey[]).filter((k) => panels[k].open && panels[k].minimized);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{ pointerEvents: "auto" }}>
        <GeoGridDock
          open={{
            postes: panels.postes.open && !panels.postes.minimized,
            cto: panels.cto.open && !panels.cto.minimized,
            caixa: panels.caixa.open && !panels.caixa.minimized,
            cliente: panels.cliente.open && !panels.cliente.minimized,
            nota: panels.nota.open && !panels.nota.minimized,
          }}
          toggle={(k) => toggleDock(k as DockKey)}
        />
      </div>

      <div style={{ pointerEvents: "auto" }}>
        {Panel("postes", "Postes", <MapPin size={16} />)}
        {Panel("cto", "CTO", <Network size={16} />)}
        {Panel("caixa", "Caixa", <Box size={16} />)}
        {Panel("cliente", "Cliente", <User size={16} />)}
        {Panel("nota", "Anotações", <StickyNote size={16} />)}
      </div>

      {minimizedKeys.length > 0 ? (
        <div style={{ pointerEvents: "auto", position: "absolute", left: 12, bottom: 12, zIndex: 4000 }}>
          <div
            style={{
              display: "flex",
              gap: 10,
              padding: 10,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(18,18,22,0.72)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
            }}
          >
            {minimizedKeys.map((k) => (
              <button
                key={k}
                onClick={() => restoreFromBar(k)}
                title="Restaurar"
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(177,0,255,0.22)",
                  color: "white",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                {k.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.25)",
  color: "white",
  fontWeight: 900,
  cursor: "pointer",
};

const hintStyle: React.CSSProperties = {
  fontSize: 12,
  opacity: 0.8,
};

const searchWrapStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  gap: 8,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.20)",
  padding: "8px 10px",
};

const searchInputStyle: React.CSSProperties = {
  width: "100%",
  border: "none",
  outline: "none",
  background: "transparent",
  color: "white",
  fontSize: 13,
};