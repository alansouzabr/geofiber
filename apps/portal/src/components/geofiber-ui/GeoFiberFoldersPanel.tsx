"use client";

import React, { useState } from "react";
import { FolderPlus, Folder, X, Search } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const initialFolders = [
  "Projeto Principal",
  "Postes",
  "CTOs",
  "Caixas",
  "Clientes",
  "Notas Técnicas",
];

export default function GeoFiberFoldersPanel({ open, onClose }: Props) {
  const [folders, setFolders] = useState(initialFolders);
  const [name, setName] = useState("");
  const [filter, setFilter] = useState("");

  if (!open) return null;

  const visible = folders.filter((f) =>
    f.toLowerCase().includes(filter.toLowerCase())
  );

  function addFolder() {
    const n = name.trim();
    if (!n) return;
    if (folders.includes(n)) return;
    setFolders((prev) => [n, ...prev]);
    setName("");
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 74,
        left: 14,
        zIndex: 9050,
        width: 340,
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.16)",
        background: "rgba(19,19,23,0.96)",
        boxShadow: "0 16px 50px rgba(0,0,0,0.35)",
        color: "white",
      }}
    >
      <div
        style={{
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          background: "linear-gradient(90deg,var(--gf-primary,#8f008f),var(--gf-secondary,#a90097))",
          borderBottom: "1px solid rgba(255,255,255,0.14)",
          fontWeight: 900,
        }}
      >
        <span>Pastas do Projeto</span>

        <button type="button" onClick={onClose} style={closeBtn}>
          <X size={14} />
        </button>
      </div>

      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={searchWrap}>
          <Search size={16} />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Buscar pasta"
            style={searchInput}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nova pasta"
            style={baseInput}
          />
          <button type="button" onClick={addFolder} style={addBtn}>
            <FolderPlus size={16} />
          </button>
        </div>

        <div
          style={{
            maxHeight: 300,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            paddingRight: 2,
          }}
        >
          {visible.map((folder) => (
            <button key={folder} type="button" style={folderBtn}>
              <Folder size={16} />
              <span>{folder}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const closeBtn: React.CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: 6,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(0,0,0,0.18)",
  color: "white",
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
};

const searchWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  height: 36,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.14)",
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

const baseInput: React.CSSProperties = {
  height: 36,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  padding: "0 10px",
  outline: "none",
};

const addBtn: React.CSSProperties = {
  width: 40,
  height: 36,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "linear-gradient(90deg,var(--gf-primary,#8f008f),var(--gf-secondary,#a90097))",
  color: "white",
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
};

const folderBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  width: "100%",
  height: 38,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  cursor: "pointer",
  padding: "0 10px",
  textAlign: "left",
};