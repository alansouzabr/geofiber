"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  FolderOpen,
  Folder,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

import type { Feature } from "@/components/geofiber-map/editor/types";
import type { ProjectFolderNode } from "@/components/geofiber-map/types/project";

type Props = {
  folders: ProjectFolderNode[];
  features: Feature[];
  selectedId: string | null;
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string) => void;
  onSelectFeature: (id: string) => void;
  onToggleFolderVisible: (folderId: string) => void;
  onToggleFolderExpanded: (folderId: string) => void;
  onCreateFolder: (parentId: string | null) => void;
  onRenameFolder: (folderId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onRequestAddToFolder: (folderId: string) => void;
  onOpenFeatureForm: (featureId: string) => void;
  onMoveFeatureToFolder: (featureId: string) => void;
  onRenameFeature: (featureId: string) => void;
  onDeleteFeature: (featureId: string) => void;
};

type ContextMenuState = {
  open: boolean;
  x: number;
  y: number;
  featureId: string | null;
};

export default function GeoFiberProjectTreePanel({
  folders,
  features,
  selectedId,
  selectedFolderId,
  onSelectFolder,
  onSelectFeature,
  onToggleFolderVisible,
  onToggleFolderExpanded,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onRequestAddToFolder,
  onOpenFeatureForm,
  onMoveFeatureToFolder,
  onRenameFeature,
  onDeleteFeature,
}: Props) {
  const [query, setQuery] = useState("");
  const [pos, setPos] = useState({ x: 8, y: 84 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [ctx, setCtx] = useState<ContextMenuState>({
    open: false,
    x: 0,
    y: 0,
    featureId: null,
  });

  const dragRef = useRef<{ active: boolean; dx: number; dy: number }>({
    active: false,
    dx: 0,
    dy: 0,
  });

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!dragRef.current.active) return;
      setPos({
        x: Math.max(6, e.clientX - dragRef.current.dx),
        y: Math.max(70, e.clientY - dragRef.current.dy),
      });
    }

    function onUp() {
      dragRef.current.active = false;
    }

    function onDocClick() {
      setCtx((prev) => ({ ...prev, open: false }));
      setMenuOpen(false);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("click", onDocClick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("click", onDocClick);
    };
  }, []);

  const byParent = useMemo(() => {
    const map = new Map<string | null, ProjectFolderNode[]>();
    for (const folder of folders) {
      const key = folder.parentId ?? null;
      const list = map.get(key) || [];
      list.push(folder);
      map.set(key, list);
    }
    for (const [, list] of map) {
      list.sort((a, b) => {
        const ao = a.sortOrder ?? 0;
        const bo = b.sortOrder ?? 0;
        if (ao !== bo) return ao - bo;
        return a.name.localeCompare(b.name);
      });
    }
    return map;
  }, [folders]);

  const q = query.trim().toLowerCase();

  const visibleTopFolders = useMemo(() => {
    const base = folders.filter(
      (f) => f.parentId === "folder_sbc" || f.id === "folder_sbc"
    );

    return base.filter((f) => {
      if (!q) return true;
      return f.name.toLowerCase().includes(q);
    });
  }, [folders, q]);

  const currentFolder = useMemo(
    () => folders.find((f) => f.id === selectedFolderId) || null,
    [folders, selectedFolderId]
  );

  const currentItems = useMemo(() => {
    const base = features.filter((f) => (f.folderId || null) === (selectedFolderId || null));
    const filtered = !q
      ? base
      : base.filter((f) =>
          `${f.name || ""} ${f.type || ""} ${f.notes || ""}`.toLowerCase().includes(q)
        );
    return filtered.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
  }, [features, selectedFolderId, q]);

  function beginDrag(e: React.MouseEvent<HTMLDivElement>) {
    dragRef.current.active = true;
    dragRef.current.dx = e.clientX - pos.x;
    dragRef.current.dy = e.clientY - pos.y;
  }

  function countItems(folderId: string) {
    return features.filter((f) => (f.folderId || null) === folderId).length;
  }

  function canDeleteFolder(folder: ProjectFolderNode) {
    if (folder.kind === "root") return false;
    const hasChildren = folders.some((f) => f.parentId === folder.id);
    const hasItems = features.some((f) => (f.folderId || null) === folder.id);
    return !hasChildren && !hasItems;
  }

  function openContextMenu(
    e: React.MouseEvent<HTMLButtonElement>,
    featureId: string
  ) {
    e.preventDefault();
    e.stopPropagation();
    setCtx({
      open: true,
      x: e.clientX,
      y: e.clientY,
      featureId,
    });
  }

  function closeContextMenu() {
    setCtx((prev) => ({ ...prev, open: false, featureId: null }));
  }

  const selectedFeature = ctx.featureId
    ? features.find((f) => f.id === ctx.featureId) || null
    : null;

  return (
    <div
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        zIndex: 4200,
        width: 340,
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.10)",
        background: "#bdbdbd",
        boxShadow: "0 16px 36px rgba(0,0,0,0.30)",
        color: "#222",
      }}
    >
      <div
        onMouseDown={beginDrag}
        style={{
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 8px",
          background: "linear-gradient(180deg,#b400a6,#8f008f)",
          color: "white",
          cursor: "move",
          userSelect: "none",
          fontWeight: 800,
          fontSize: 12,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FolderOpen size={13} />
          Estrutura do Projeto
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
          style={topBtn}
        >
          <Plus size={12} />
          Nova pasta
        </button>
      </div>

      {menuOpen ? (
        <div
          style={{
            position: "absolute",
            top: 32,
            right: 8,
            zIndex: 10,
            width: 190,
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.10)",
            background: "#c5c5c5",
            boxShadow: "0 10px 22px rgba(0,0,0,0.22)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onCreateFolder("folder_sbc");
            }}
            style={menuItem}
          >
            Nova pasta
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              if (selectedFolderId) onCreateFolder(selectedFolderId);
            }}
            style={menuItem}
          >
            Nova subpasta
          </button>
        </div>
      ) : null}

      <div style={{ padding: 8, borderBottom: "1px solid rgba(0,0,0,0.08)", background: "#c6c6c6" }}>
        <div style={searchWrap}>
          <Search size={13} style={{ opacity: 0.8 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar endereço"
            style={searchInput}
          />
        </div>
      </div>

      <div style={{ padding: 8, background: "#c2c2c2", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflow: "auto" }}>
          {visibleTopFolders.map((folder) => {
            const expanded = folder.expanded !== false;
            const active = selectedFolderId === folder.id;
            const deletable = canDeleteFolder(folder);

            return (
              <div key={folder.id}>
                <div
                  style={{
                    ...folderRow,
                    background: active ? "#d7d7d7" : "#cdcdcd",
                    borderColor: active ? "#8c8c8c" : "#b4b4b4",
                  }}
                  onClick={() => onSelectFolder(folder.id)}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFolderExpanded(folder.id);
                    }}
                    style={squareBtn}
                    title={expanded ? "Recolher" : "Expandir"}
                  >
                    {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  </button>

                  <input
                    type="checkbox"
                    checked={folder.visible !== false}
                    onChange={(e) => {
                      e.stopPropagation();
                      onToggleFolderVisible(folder.id);
                    }}
                  />

                  {expanded ? <FolderOpen size={13} /> : <Folder size={13} />}

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={folderTitle}>{folder.name}</div>
                    <div style={folderMeta}>{countItems(folder.id)} item(ns)</div>
                  </div>

                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCreateFolder(folder.id);
                      }}
                      style={squareBtn}
                      title="Nova subpasta"
                    >
                      <Plus size={11} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRenameFolder(folder.id);
                      }}
                      style={squareBtn}
                      title="Editar"
                    >
                      <Pencil size={11} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!deletable) return;
                        onDeleteFolder(folder.id);
                      }}
                      style={{
                        ...squareBtn,
                        opacity: deletable ? 1 : 0.35,
                        cursor: deletable ? "pointer" : "not-allowed",
                      }}
                      title={deletable ? "Excluir pasta" : "Só exclui pasta vazia"}
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: 8, background: "#bfbfbf" }}>
        <div
          style={{
            ...sectionHead,
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: 12 }}>
              {currentFolder?.name || "Itens"}
            </div>
            <div style={{ fontSize: 10, opacity: 0.8 }}>
              {currentItems.length} item(ns)
            </div>
          </div>

          {selectedFolderId ? (
            <button
              type="button"
              onClick={() => onRequestAddToFolder(selectedFolderId)}
              style={addBtn}
              title="Adicionar item nesta pasta"
            >
              <Plus size={12} />
              Adicionar
            </button>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 250, overflow: "auto", paddingTop: 6 }}>
          {currentItems.length === 0 ? (
            <div style={{ fontSize: 12, opacity: 0.75, padding: "6px 4px" }}>
              Nenhum item nesta pasta.
            </div>
          ) : (
            currentItems.map((item) => {
              const active = selectedId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectFeature(item.id)}
                  onContextMenu={(e) => openContextMenu(e, item.id)}
                  style={{
                    ...itemRow,
                    background: active ? "#d7d7d7" : "#d0d0d0",
                    borderColor: active ? "#8c8c8c" : "#b4b4b4",
                  }}
                >
                  <span style={itemName}>{item.name || "(sem nome)"}</span>
                  <span style={itemType}>{item.type}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {ctx.open && selectedFeature ? (
        <div
          style={{
            position: "fixed",
            left: ctx.x,
            top: ctx.y,
            zIndex: 5000,
            width: 170,
            borderRadius: 6,
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.16)",
            background: "#c8c8c8",
            boxShadow: "0 12px 24px rgba(0,0,0,0.22)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            style={contextItem}
            onClick={() => {
              closeContextMenu();
              onOpenFeatureForm(selectedFeature.id);
            }}
          >
            Abrir ficha
          </button>
          <button
            type="button"
            style={contextItem}
            onClick={() => {
              closeContextMenu();
              onMoveFeatureToFolder(selectedFeature.id);
            }}
          >
            Mover para outra pasta
          </button>
          <button
            type="button"
            style={contextItem}
            onClick={() => {
              closeContextMenu();
              onRenameFeature(selectedFeature.id);
            }}
          >
            Renomear
          </button>
          <button
            type="button"
            style={contextItem}
            onClick={() => {
              closeContextMenu();
              onDeleteFeature(selectedFeature.id);
            }}
          >
            Excluir
          </button>
        </div>
      ) : null}
    </div>
  );
}

const topBtn: React.CSSProperties = {
  height: 22,
  borderRadius: 6,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.10)",
  color: "white",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "0 8px",
  fontSize: 11,
  fontWeight: 700,
};

const searchWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  height: 28,
  borderRadius: 6,
  border: "1px solid rgba(0,0,0,0.10)",
  background: "#d7d7d7",
  padding: "0 8px",
};

const searchInput: React.CSSProperties = {
  width: "100%",
  border: "none",
  outline: "none",
  background: "transparent",
  color: "#222",
  fontSize: 12,
};

const folderRow: React.CSSProperties = {
  minHeight: 32,
  borderRadius: 6,
  border: "1px solid #b4b4b4",
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "0 6px",
  color: "#222",
  cursor: "pointer",
};

const folderTitle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const folderMeta: React.CSSProperties = {
  fontSize: 10,
  opacity: 0.75,
};

const squareBtn: React.CSSProperties = {
  width: 20,
  height: 20,
  borderRadius: 4,
  border: "1px solid rgba(0,0,0,0.10)",
  background: "#d9d9d9",
  color: "#222",
  cursor: "pointer",
  display: "grid",
  placeItems: "center",
  padding: 0,
  flexShrink: 0,
};

const sectionHead: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const addBtn: React.CSSProperties = {
  height: 24,
  borderRadius: 6,
  border: "1px solid rgba(0,0,0,0.10)",
  background: "#d8d8d8",
  color: "#222",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "0 8px",
  fontSize: 11,
  fontWeight: 700,
};

const itemRow: React.CSSProperties = {
  minHeight: 28,
  borderRadius: 6,
  border: "1px solid #b4b4b4",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  padding: "0 8px",
  color: "#222",
  cursor: "pointer",
  textAlign: "left",
};

const itemName: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const itemType: React.CSSProperties = {
  fontSize: 10,
  opacity: 0.7,
  flexShrink: 0,
};

const menuItem: React.CSSProperties = {
  width: "100%",
  height: 32,
  border: "none",
  borderBottom: "1px solid rgba(0,0,0,0.08)",
  background: "transparent",
  color: "#222",
  cursor: "pointer",
  textAlign: "left",
  padding: "0 10px",
  fontSize: 12,
};

const contextItem: React.CSSProperties = {
  width: "100%",
  height: 34,
  border: "none",
  borderBottom: "1px solid rgba(0,0,0,0.08)",
  background: "transparent",
  color: "#222",
  cursor: "pointer",
  textAlign: "left",
  padding: "0 10px",
  fontSize: 12,
};