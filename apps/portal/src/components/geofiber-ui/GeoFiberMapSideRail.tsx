"use client";

import React, { useState } from "react";
import {
  MapPinned,
  Circle,
  GitBranch,
  Package,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type RailKey = "postes" | "rede" | "caixas" | "clientes" | "anotacoes";

type Props = {
  active: RailKey | null;
  onSelect: (key: RailKey) => void;
};

function RailButton({
  active,
  icon,
  title,
  onClick,
}: {
  active?: boolean;
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        border: active
          ? "1px solid rgba(255,255,255,0.22)"
          : "1px solid rgba(255,255,255,0.10)",
        background: active
          ? "rgba(255,255,255,0.16)"
          : "rgba(255,255,255,0.06)",
        color: "white",
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
        padding: 0,
      }}
    >
      {icon}
    </button>
  );
}

export default function GeoFiberMapSideRail({ active, onSelect }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{
        position: "absolute",
        top: 84,
        left: 0,
        bottom: 0,
        zIndex: 4200,
        width: collapsed ? 20 : 54,
        background: "rgba(34,34,38,0.88)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 10px 24px rgba(0,0,0,0.22)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 8,
        paddingBottom: 8,
        gap: 8,
        transition: "width .18s ease",
      }}
    >
      <button
        type="button"
        title={collapsed ? "Expandir barra" : "Minimizar barra"}
        onClick={() => setCollapsed((v) => !v)}
        style={{
          width: collapsed ? 14 : 38,
          height: 24,
          borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(255,255,255,0.06)",
          color: "white",
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
          padding: 0,
          marginBottom: 4,
        }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={14} />}
      </button>

      {!collapsed ? (
        <>
          <RailButton
            active={active === "postes"}
            icon={<Circle size={14} fill="currentColor" />}
            title="Postes"
            onClick={() => onSelect("postes")}
          />
          <RailButton
            active={active === "rede"}
            icon={<GitBranch size={18} />}
            title="Rede"
            onClick={() => onSelect("rede")}
          />
          <RailButton
            active={active === "caixas"}
            icon={<Package size={18} />}
            title="Caixas"
            onClick={() => onSelect("caixas")}
          />
          <RailButton
            active={active === "clientes"}
            icon={<Users size={18} />}
            title="Clientes"
            onClick={() => onSelect("clientes")}
          />
          <RailButton
            active={active === "anotacoes"}
            icon={<FileText size={18} />}
            title="Anotações"
            onClick={() => onSelect("anotacoes")}
          />

          <div style={{ flex: 1 }} />
        </>
      ) : (
        <div style={{ flex: 1 }} />
      )}
    </div>
  );
}