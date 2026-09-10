"use client";

import React from "react";
import type { PaletteGroup, Tool } from "./types";

type Item = {
  label: string;
  tool: Tool;
  meta?: Record<string, any>;
};

type Group = {
  id: PaletteGroup;
  label: string;
  items: Item[];
};

const GROUPS: Group[] = [
  {
    id: "poles",
    label: "Postes",
    items: [
      { label: "Poste de madeira", tool: "add_pole", meta: { iconKey: "pole_wood" } },
      { label: "Poste de concreto", tool: "add_pole", meta: { iconKey: "pole_concrete" } },
      { label: "Poste metálico", tool: "add_pole", meta: { iconKey: "pole_metal" } },
    ],
  },
  { id: "ctos", label: "CTO", items: [{ label: "Adicionar CTO", tool: "add_cto", meta: { iconKey: "cto" } }] },
  { id: "splice", label: "Caixa", items: [{ label: "Caixa de emenda", tool: "add_splice", meta: { iconKey: "splice" } }] },
  { id: "customers", label: "Cliente", items: [{ label: "Adicionar cliente", tool: "add_customer", meta: { iconKey: "customer" } }] },
  { id: "notes", label: "Anotação", items: [{ label: "Nota interna", tool: "add_note", meta: { iconKey: "note" } }] },
];

export default function Palette({
  openGroup,
  setOpenGroup,
  activeTool,
  setActiveTool,
  setToolMeta,
}: {
  openGroup: PaletteGroup | null;
  setOpenGroup: (g: PaletteGroup | null) => void;
  activeTool: Tool;
  setActiveTool: (t: Tool) => void;
  setToolMeta: (m: any) => void;
}) {
  return (
    <div style={{ position: "absolute", zIndex: 1300, right: 16, top: 16 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          background: "rgba(10,12,18,0.80)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(10px)",
          borderRadius: 14,
          padding: 10,
          color: "white",
          width: 220,
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 13, opacity: 0.9 }}>Ferramentas</div>

        {GROUPS.map((g) => {
          const isOpen = openGroup === g.id;
          return (
            <div key={g.id} style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setOpenGroup(isOpen ? null : g.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 10px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: isOpen ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                <span>{g.label}</span>
                <span style={{ opacity: 0.8 }}>{isOpen ? "▴" : "▾"}</span>
              </button>

              {isOpen && (
                <div
                  style={{
                    marginTop: 8,
                    padding: 8,
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {g.items.map((it) => {
                    const isActive = activeTool === it.tool;
                    return (
                      <button
                        key={it.label}
                        type="button"
                        onClick={() => {
                          setActiveTool(it.tool);
                          setToolMeta(it.meta || {});
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "9px 10px",
                          borderRadius: 10,
                          border: "1px solid rgba(255,255,255,0.10)",
                          background: isActive ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.06)",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        {it.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.3 }}>
          Dica: selecione uma ferramenta e clique no mapa para inserir.
        </div>
      </div>
    </div>
  );
}