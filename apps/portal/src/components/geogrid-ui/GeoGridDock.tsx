"use client";

import React from "react";
import { MapPin, Network, Box, User, StickyNote } from "lucide-react";

type DockKey = "postes" | "cto" | "caixa" | "cliente" | "nota";

export default function GeoGridDock({
  open,
  toggle,
}: {
  open: Record<DockKey, boolean>;
  toggle: (k: DockKey) => void;
}) {
  const btn = (k: DockKey, label: string, Icon: any) => {
    const active = open[k];
    return (
      <button
        key={k}
        onClick={() => toggle(k)}
        title={label}
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.12)",
          background: active ? "rgba(177,0,255,0.35)" : "rgba(0,0,0,0.45)",
          color: "white",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
          boxShadow: active ? "0 10px 25px rgba(177,0,255,0.25)" : "none",
        }}
      >
        <Icon size={18} />
      </button>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 110,
        left: 12,
        zIndex: 3000,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: 10,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(18,18,22,0.72)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
      }}
    >
      {btn("postes", "Postes", MapPin)}
      {btn("cto", "CTO", Network)}
      {btn("caixa", "Caixa", Box)}
      {btn("cliente", "Cliente", User)}
      {btn("nota", "Anotações", StickyNote)}
    </div>
  );
}