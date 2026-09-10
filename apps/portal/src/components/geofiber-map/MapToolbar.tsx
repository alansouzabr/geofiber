"use client";

import React from "react";

export type MapTool =
  | "select"
  | "pole"
  | "splice_box"
  | "cto"
  | "fiber_draw"
  | "client"
  | "delete";

const TOOL_LABEL: Record<MapTool, string> = {
  select: "Selecionar",
  pole: "Poste",
  splice_box: "Caixa",
  cto: "CTO",
  fiber_draw: "Fibra",
  client: "Cliente",
  delete: "Apagar",
};

export function MapToolbar({
  tool,
  setTool,
}: {
  tool: MapTool;
  setTool: (t: MapTool) => void;
}) {
  const tools: MapTool[] = ["select", "pole", "splice_box", "cto", "fiber_draw", "client", "delete"];

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 1000,
        top: 14,
        left: 14,
        display: "flex",
        gap: 8,
        padding: 10,
        borderRadius: 14,
        background: "rgba(10, 12, 18, 0.70)",
        border: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(8px)",
      }}
    >
      {tools.map((t) => {
        const active = tool === t;
        return (
          <button
            key={t}
            type="button"
            onClick={() => setTool(t)}
            style={{
              cursor: "pointer",
              padding: "8px 10px",
              borderRadius: 12,
              fontSize: 13,
              border: active ? "1px solid rgba(255,255,255,0.35)" : "1px solid rgba(255,255,255,0.10)",
              background: active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
              color: "white",
              whiteSpace: "nowrap",
            }}
            title={TOOL_LABEL[t]}
            aria-pressed={active}
          >
            {TOOL_LABEL[t]}
          </button>
        );
      })}
    </div>
  );
}