"use client";

import React from "react";
import {
  MapPin,
  Network,
  Box,
  User,
  StickyNote,
  FolderTree,
  Palette,
  Search,
  Crosshair,
} from "lucide-react";

type Props = {
  onToggleFolders: () => void;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
};

function RailBtn({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(24,24,28,0.92)",
        color: "white",
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
        boxShadow: "0 8px 22px rgba(0,0,0,0.18)",
      }}
    >
      {children}
    </button>
  );
}

export default function GeoFiberLeftRail({
  onToggleFolders,
  onToggleTheme,
  onOpenSearch,
}: Props) {
  return (
    <div
      style={{
        position: "absolute",
        top: 106,
        left: 14,
        zIndex: 4200,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 8,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(18,18,22,0.72)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.28)",
      }}
    >
      <RailBtn title="Buscar endereço" onClick={onOpenSearch}>
        <Search size={17} />
      </RailBtn>

      <RailBtn title="Centralizar">
        <Crosshair size={17} />
      </RailBtn>

      <RailBtn title="Postes">
        <MapPin size={17} />
      </RailBtn>

      <RailBtn title="CTO">
        <Network size={17} />
      </RailBtn>

      <RailBtn title="Caixas">
        <Box size={17} />
      </RailBtn>

      <RailBtn title="Clientes">
        <User size={17} />
      </RailBtn>

      <RailBtn title="Notas">
        <StickyNote size={17} />
      </RailBtn>

      <RailBtn title="Pastas" onClick={onToggleFolders}>
        <FolderTree size={17} />
      </RailBtn>

      <RailBtn title="Paleta" onClick={onToggleTheme}>
        <Palette size={17} />
      </RailBtn>
    </div>
  );
}