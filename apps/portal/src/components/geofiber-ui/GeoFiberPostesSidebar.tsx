"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Minus,
  Square,
  Search,
  MoreVertical,
  Circle,
  ArrowLeft,
  ArrowRight,
  FolderPlus,
} from "lucide-react";
import type { Feature } from "@/components/geofiber-map/editor/types";
import {
  listProjectFolders,
  createProjectFolder,
  renameProjectFolder,
  deleteProjectFolder,
  type ProjectFolderDto,
} from "@/services/project-folders";

type PolePreset = "redondo";

type Props = {
  open: boolean;
  items: Feature[];
  selectedId: string | null;
  activePreset: PolePreset;
  addPoleModeActive: boolean;
  currentFolderId: string | null;
  onCurrentFolderChange: (folderId: string | null) => void;
  onSelect: (id: string) => void;
  onChoosePreset: (preset: PolePreset) => void;
  onToggleAddPoleMode: () => void;
  onOpenNotes: (id: string) => void;
  onMoveToFolder: (id: string, folderId: string | null) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
};

type CtxState = {
  open: boolean;
  x: number;
  y: number;
  itemId: string | null;
  folderId?: string | null;
  kind?: "feature" | "folder" | null;
};

type FolderNode = {
  id: string;
  name: string;
  path: string[];
};

function labelOf(feature: Feature) {
  return String(feature.name || "Poste redondo");
}

export default function GeoFiberPostesSidebar({
  open,
  items,
  selectedId,
  activePreset,
  addPoleModeActive,
  currentFolderId,
  onCurrentFolderChange,
  onSelect,
  onChoosePreset,
  onToggleAddPoleMode,
  onOpenNotes,
  onMoveToFolder,
  onRename,
  onDelete,
}: Props) {
  const [query, setQuery] = useState("");
  const [clickAdd,setClickAdd] = useState(false);
  const [folderPath, setFolderPath] = useState<string[]>([
    "Início",
    "São Bernardo do Campo - SP",
    "SBC-CTOPS",
  ]);
  const [folders, setFolders] = useState<FolderNode[]>([]);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [renameFolderId, setRenameFolderId] = useState<string | null>(null);
  const [renameFolderName, setRenameFolderName] = useState("");
  const [deleteFolderId, setDeleteFolderId] = useState<string | null>(null);
  const [movePoleId, setMovePoleId] = useState<string | null>(null);
  const [movePoleTargetId, setMovePoleTargetId] = useState<string | null>(null);
  const [backHistory, setBackHistory] = useState<string[][]>([]);
  const [forwardHistory, setForwardHistory] = useState<string[][]>([]);
  const [minimized, setMinimized] = useState(false);
  const [pos, setPos] = useState({ x: 2, y: 60 });
  const [size, setSize] = useState({ w: 395, h: 570 });
  const [ctx, setCtx] = useState<CtxState>({
    open: false,
    x: 0,
    y: 0,
    itemId: null,
    folderId: null,
    kind: null,
  });

  const dragRef = useRef<{ active: boolean; dx: number; dy: number }>({
    active: false,
    dx: 0,
    dy: 0,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const scoped = items.filter(
      (item: any) => ((item.folderId || null) === (currentFolderId || null))
    );

    if (!q) return scoped;

    return scoped.filter((item) => {
      const text = `${item.name || ""} ${item.notes || ""}`.toLowerCase();
      return text.includes(q);
    });
  }, [items, query, currentFolderId]);

  const visibleFolders = useMemo(() => {
    const currentDepth = folderPath.length;
    const q = query.trim().toLowerCase();

    return folders.filter((folder) => {
      if (folder.path.length !== currentDepth + 1) return false;

      const sameParent = folderPath.every((segment, index) => folder.path[index] === segment);
      if (!sameParent) return false;

      if (!q) return true;
      return folder.name.toLowerCase().includes(q);
    });
  }, [folders, folderPath, query]);

  useEffect(() => {
    if (folderPath.length <= 1) return;

    const exactExists = folders.some(
      (folder) => folder.path.join(" / ") === folderPath.join(" / ")
    );

    const hasChildrenUnderPath = folders.some((folder) => {
      if (folder.path.length <= folderPath.length) return false;
      return folderPath.every((segment, index) => folder.path[index] === segment);
    });

    if (!exactExists && !hasChildrenUnderPath) {
      setFolderPath(["Início"]);
      setBackHistory([]);
      setForwardHistory([]);
    }
  }, [folders, folderPath]);

  const ctxItem = useMemo(
    () => items.find((item) => item.id === ctx.itemId) || null,
    [items, ctx.itemId]
  );

  useEffect(() => {
    if (!open) return;

    let alive = true;

    function buildPaths(rows: ProjectFolderDto[]): FolderNode[] {
      const byId = new Map(rows.map((r) => [r.id, r]));
      const cache = new Map<string, string[]>();

      function resolvePath(id: string, stack = new Set<string>()): string[] {
        if (cache.has(id)) return cache.get(id)!;
        const row = byId.get(id);
        if (!row) return ["Início"];
        if (stack.has(id)) return ["Início", row.name];

        stack.add(id);

        const path = row.parentId
          ? [...resolvePath(row.parentId, stack), row.name]
          : ["Início", row.name];

        cache.set(id, path);
        stack.delete(id);
        return path;
      }

      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        path: resolvePath(row.id),
      }));
    }

    (async () => {
      try {
        const data = await listProjectFolders();
        if (!alive) return;
        setFolders(buildPaths(Array.isArray(data) ? data : []));
      } catch (err) {
        console.error("Erro ao carregar pastas:", err);
        if (!alive) return;
        setFolders([]);
      }
    })();

    return () => {
      alive = false;
    };
  }, [open]);

  const ctxFolder = useMemo(
    () => folders.find((folder) => folder.id === (ctx.folderId || null)) || null,
    [folders, ctx.folderId]
  );

  const folderToRename = useMemo(
    () => folders.find((folder) => folder.id === renameFolderId) || null,
    [folders, renameFolderId]
  );

  const folderToDelete = useMemo(
    () => folders.find((folder) => folder.id === deleteFolderId) || null,
    [folders, deleteFolderId]
  );

  const currentFolder = useMemo(
    () =>
      folderPath.length <= 1
        ? null
        : folders.find((folder) => folder.path.join(" / ") === folderPath.join(" / ")) || null,
    [folders, folderPath]
  );

  async function handleConfirmMovePole() {
    if (!movePoleId) return;

    try {
      await onMoveToFolder(movePoleId, movePoleTargetId ?? null);
      setMovePoleId(null);
      setMovePoleTargetId(null);
    } catch (err) {
      console.error("Erro ao mover poste:", err);
      window.alert(`Não foi possível mover o poste.
${err instanceof Error ? err.message : String(err)}`);
    }
  }
  useEffect(() => {
    onCurrentFolderChange(currentFolder?.id ?? null);
  }, [currentFolder, onCurrentFolderChange]);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragRef.current.active) return;
      setPos({
        x: Math.max(0, e.clientX - dragRef.current.dx),
        y: Math.max(58, e.clientY - dragRef.current.dy),
      });
    }

    function onMouseUp() {
      dragRef.current.active = false;
    }

    function onWindowClick() {
      setCtx((prev) => ({ ...prev, open: false, itemId: null, folderId: null, kind: null }));
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("click", onWindowClick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("click", onWindowClick);
    };
  }, []);

  if (!open) return null;

  function beginDrag(e: React.MouseEvent<HTMLDivElement>) {
    dragRef.current.active = true;
    dragRef.current.dx = e.clientX - pos.x;
    dragRef.current.dy = e.clientY - pos.y;
  }

  function navigateToPath(nextPath: string[]) {
    if (nextPath.join(" / ") === folderPath.join(" / ")) return;
    setBackHistory((prev) => [...prev, folderPath]);
    setForwardHistory([]);
    setFolderPath(nextPath);
  }

  function handleGoBack() {
    if (backHistory.length === 0) return;
    const previousPath = backHistory[backHistory.length - 1];
    setBackHistory((prev) => prev.slice(0, -1));
    setForwardHistory((prev) => [folderPath, ...prev]);
    setFolderPath(previousPath);
  }

  function handleGoForward() {
    if (forwardHistory.length === 0) return;
    const nextPath = forwardHistory[0];
    setForwardHistory((prev) => prev.slice(1));
    setBackHistory((prev) => [...prev, folderPath]);
    setFolderPath(nextPath);
  }

  async function handleCreateFolder() {
    const cleanName = newFolderName.trim();
    if (!cleanName) return;

    const parentFolder =
      folderPath.length <= 1
        ? null
        : folders.find((folder) => folder.path.join(" / ") === folderPath.join(" / ")) || null;

    try {
      const created = await createProjectFolder({
        name: cleanName,
        parentId: parentFolder?.id ?? null,
      });

      const nextPath = parentFolder ? [...parentFolder.path, created.name] : ["Início", created.name];

      setFolders((prev) => [
        ...prev,
        {
          id: created.id,
          name: created.name,
          path: nextPath,
        },
      ]);

      setNewFolderName("");
      setCreateFolderOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Erro ao criar pasta:", msg, err);
      window.alert(`Não foi possível criar a pasta.

Motivo: ${msg}

Verifique sua sessão e tente novamente.`);
    }
  }

  function folderHasChildren(target: FolderNode) {
    return folders.some(
      (folder) =>
        folder.id !== target.id &&
        folder.path.length > target.path.length &&
        target.path.every((segment, index) => folder.path[index] === segment)
    );
  }

  function handleOpenRenameFolder(folder: FolderNode) {
    setRenameFolderId(folder.id);
    setRenameFolderName(folder.name);
  }

  async function handleRenameFolder() {
    if (!folderToRename) return;

    const cleanName = renameFolderName.trim();
    if (!cleanName) return;

    const oldPath = folderToRename.path;
    const newPath = [...oldPath.slice(0, -1), cleanName];

    const duplicate = folders.some(
      (folder) =>
        folder.id !== folderToRename.id &&
        folder.path.join(" / ").toLowerCase() === newPath.join(" / ").toLowerCase()
    );
    if (duplicate) return;

    try {
      await renameProjectFolder(folderToRename.id, {
        name: cleanName,
      });

      setFolders((prev) =>
        prev.map((folder) => {
          const matchesPrefix =
            folder.path.length >= oldPath.length &&
            oldPath.every((segment, index) => folder.path[index] === segment);

          if (!matchesPrefix) return folder;

          const updatedPath = [...newPath, ...folder.path.slice(oldPath.length)];

          return {
            ...folder,
            name: folder.id === folderToRename.id ? cleanName : folder.name,
            path: updatedPath,
          };
        })
      );

      if (
        folderPath.length >= oldPath.length &&
        oldPath.every((segment, index) => folderPath[index] === segment)
      ) {
        setFolderPath([...newPath, ...folderPath.slice(oldPath.length)]);
      }

      setBackHistory([]);
      setForwardHistory([]);
      setRenameFolderId(null);
      setRenameFolderName("");
    } catch (err) {
      console.error("Erro ao renomear pasta:", err);
      window.alert(`Não foi possível renomear a pasta.\n${err instanceof Error ? err.message : String(err)}`);
    }
  }

  function handleDeleteFolder() {
    if (!folderToDelete) return;
    handleDeleteFolderById(folderToDelete.id);
  }

  async function handleDeleteFolderById(folderId: string) {
    const targetFolder = folders.find((folder) => folder.id === folderId);
    if (!targetFolder) return;
    if (folderHasChildren(targetFolder)) return;

    const targetPath = targetFolder.path;
    const parentPath = targetPath.slice(0, -1);

    try {
      await deleteProjectFolder(folderId);

      setFolders((prev) => prev.filter((folder) => folder.id !== folderId));

      const currentInsideDeleted =
        folderPath.length >= targetPath.length &&
        targetPath.every((segment, index) => folderPath[index] === segment);

      if (currentInsideDeleted && parentPath.length > 0) {
        setFolderPath(parentPath);
      }

      setBackHistory([]);
      setForwardHistory([]);
      setDeleteFolderId(null);
    } catch (err) {
      console.error("Erro ao excluir pasta:", err);
      window.alert(`Não foi possível excluir a pasta.\n${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: pos.x,
          top: pos.y,
          zIndex: 4700,
          width: size.w,
          height: minimized ? 31 : size.h,
          minWidth: 280,
          minHeight: minimized ? 31 : 260,
          maxWidth: 620,
          maxHeight: "calc(100vh - 70px)",
          border: "1px solid #8f8f8f",
          background: "#bfbfbf",
          boxShadow: "0 10px 26px rgba(0,0,0,0.24)",
          overflow: "hidden",
          resize: minimized ? "none" : "both",
        }}
        onMouseUp={(e) => {
          const el = e.currentTarget;
          setSize({
            w: el.offsetWidth,
            h: el.offsetHeight,
          });
        }}
      >
        <div
          onMouseDown={beginDrag}
          style={{
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 6px",
            background: "linear-gradient(90deg,#9d00d8,#cf20ff)",
            color: "white",
            cursor: "move",
            userSelect: "none",
            borderBottom: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            <Circle size={12} />
            <span>Postes ({items.length})</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button
              type="button"
              title={minimized ? "Restaurar" : "Minimizar"}
              onClick={(e) => {
                e.stopPropagation();
                setMinimized((v) => !v);
              }}
              style={headBtn}
            >
              {minimized ? <Square size={11} /> : <Minus size={12} />}
            </button>
          </div>
        </div>

        {minimized ? (
          <div
            style={{
              height: 3,
              background: "#bfbfbf",
              cursor: "pointer",
            }}
            onClick={() => setMinimized(false)}
            title="Restaurar"
          />
        ) : (
          <>
            <div
              style={{
                padding: "4px 8px",
                fontSize: 11,
                color: "#666",
                borderBottom: "1px solid #adadad",
                background: "#c8c8c8",
                display: "flex",
                alignItems: "center",
                gap: 4,
                flexWrap: "wrap",
              }}
            >
              {folderPath.map((segment, index) => {
                const isLast = index === folderPath.length - 1;

                return (
                  <React.Fragment key={`${segment}-${index}`}>
                    <button
                      type="button"
                      onClick={() => navigateToPath(folderPath.slice(0, index + 1))}
                      style={{
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        margin: 0,
                        color: isLast ? "#444" : "#666",
                        fontSize: 11,
                        fontWeight: isLast ? 700 : 500,
                        cursor: isLast ? "default" : "pointer",
                      }}
                      title={isLast ? "Diretório atual" : `Ir para ${segment}`}
                      disabled={isLast}
                    >
                      {segment}
                    </button>
                    {!isLast ? <span>/</span> : null}
                  </React.Fragment>
                );
              })}
            </div>

            <div
              style={{
                padding: 8,
                borderBottom: "1px solid #b1b1b1",
                background: "#cfcfcf",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 32px", gap: 6 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    height: 28,
                    padding: "0 8px",
                    border: "1px solid #b7b7b7",
                    background: "#ececec",
                  }}
                >
                  <Search size={14} color="#666" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Pesquisar..."
                    style={{
                      width: "100%",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      color: "#444",
                      fontSize: 13,
                    }}
                  />
                </div>

                <button
                  type="button"
                  title={addPoleModeActive ? "Modo inserir poste ativo · ESC para sair" : "Adicionar poste"}
                  onMouseDown={() => setClickAdd(true)}
                  onMouseUp={() => setClickAdd(false)}
                  onMouseLeave={() => setClickAdd(false)}
                  onClick={() => onToggleAddPoleMode()}
                  style={{
                    height: 28,
                    border: addPoleModeActive ? "1px solid #a000ff" : "1px solid #9e9e9e",
                    background: addPoleModeActive ? "#ece0ff" : "#dddddd",
                    color: "#444",
                    cursor: "pointer",
                    fontWeight: 700,
                    boxShadow: (clickAdd || addPoleModeActive)
                      ? "0 0 10px rgba(178,0,255,0.65), inset 0 0 4px rgba(178,0,255,0.45)"
                      : "none",
                    transform: clickAdd ? "translateY(1px)" : "none"
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div
              style={{
                padding: "6px 8px",
                borderBottom: "1px solid #b5b5b5",
                background: "#cfcfcf",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#555" }}>
                <button
                  type="button"
                  title="Voltar para a pasta anterior"
                  style={{
                    ...miniToolbarBtn,
                    opacity: backHistory.length === 0 ? 0.45 : 1,
                    cursor: backHistory.length === 0 ? "not-allowed" : "pointer",
                  }}
                  onClick={handleGoBack}
                  disabled={backHistory.length === 0}
                >
                  <ArrowLeft size={14} />
                </button>

                <button
                  type="button"
                  title="Avançar para a próxima pasta"
                  style={{
                    ...miniToolbarBtn,
                    opacity: forwardHistory.length === 0 ? 0.45 : 1,
                    cursor: forwardHistory.length === 0 ? "not-allowed" : "pointer",
                  }}
                  onClick={handleGoForward}
                  disabled={forwardHistory.length === 0}
                >
                  <ArrowRight size={14} />
                </button>

                <button
                  type="button"
                  title="Adicionar nova pasta"
                  style={miniToolbarBtn}
                  onClick={() => setCreateFolderOpen(true)}
                >
                  <FolderPlus size={14} />
                </button>

                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                  <input type="checkbox" checked readOnly />
                </label>
              </div>
            </div>

            <div style={{ height: "calc(100% - 97px)", overflow: "auto", background: "#bfbfbf" }}>
              <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                {visibleFolders.map((folder) => {
                  const isCurrent = folder.path.join(" / ") === folderPath.join(" / ");

                  return (
                    <div
                      key={folder.id}
                      onClick={() => navigateToPath(folder.path)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setCtx({
                          open: true,
                          x: e.clientX,
                          y: e.clientY,
                          itemId: null,
                          folderId: folder.id,
                          kind: "folder",
                        });
                      }}
                      style={{
                        height: 34,
                        display: "grid",
                        gridTemplateColumns: "22px 1fr 14px",
                        alignItems: "center",
                        gap: 6,
                        padding: "0 8px",
                        border: isCurrent ? "1px solid #8b8b8b" : "1px solid #a4a4a4",
                        background: isCurrent
                          ? "linear-gradient(180deg,#d8d8d8,#cfcfcf)"
                          : "linear-gradient(180deg,#e2e2e2,#d8d8d8)",
                        color: "#333",
                        cursor: "pointer",
                        boxShadow: isCurrent
                          ? "inset 0 1px 0 rgba(255,255,255,0.45), 0 0 0 1px rgba(140,0,255,0.08)"
                          : "inset 0 1px 0 rgba(255,255,255,0.35)",
                      }}
                      title={`Clique para avançar para ${folder.name}. Botão direito para opções.`}
                    >
                      <FolderClassicIcon />

                      <span
                        style={{
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          fontSize: 13,
                          fontWeight: isCurrent ? 700 : 500,
                          color: isCurrent ? "#2f2f2f" : "#3a3a3a",
                          textShadow: "0 1px 0 rgba(255,255,255,0.35)",
                        }}
                      >
                        {folder.name}
                      </span>

                      <span
                        style={{
                          textAlign: "center",
                          color: "#666",
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        ›
                      </span>
                    </div>
                  );
                })}

                {visibleFolders.length === 0 ? (
                  <div
                    style={{
                      padding: 14,
                      border: "1px dashed #a5a5a5",
                      background: "#c8c8c8",
                      color: "#666",
                      fontSize: 13,
                    }}
                  >
                    Nenhuma pasta cadastrada neste diretório.
                    <br />
                    Use o botão <b>nova pasta</b> para criar uma subpasta.
                  </div>
                ) : null}

                {filtered.length === 0 ? (
                  <div
                    style={{
                      padding: 14,
                      border: "1px dashed #a5a5a5",
                      background: "#c8c8c8",
                      color: "#666",
                      fontSize: 13,
                    }}
                  >
                    Nenhum poste cadastrado.
                    <br />
                    Escolha o botão <b>+</b> e depois clique no mapa.
                  </div>
                ) : (
                  filtered.map((item) => {
                    const active = selectedId === item.id;

                    return (
                      <div
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setCtx({
                            open: true,
                            x: e.clientX,
                            y: e.clientY,
                            itemId: item.id,
                            folderId: null,
                            kind: "feature",
                          });
                        }}
                        style={{
                          height: 32,
                          display: "grid",
                          gridTemplateColumns: "22px 1fr 24px",
                          alignItems: "center",
                          gap: 8,
                          padding: "0 8px",
                          border: active ? "1px solid #8b8b8b" : "1px solid #a4a4a4",
                          background: active ? "#d4d4d4" : "#dcdcdc",
                          color: "#333",
                          cursor: "pointer",
                        }}
                        title="Clique para selecionar. Botão direito para opções."
                      >
                        <span style={{ display: "grid", placeItems: "center" }}>
                          <Circle size={12} color="#7c7c7c" fill="#c9c9c9" />
                        </span>

                        <span
                          style={{
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                            fontSize: 13,
                          }}
                        >
                          {labelOf(item)}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCtx({
                              open: true,
                              x: e.clientX,
                              y: e.clientY,
                              itemId: item.id,
                              folderId: null,
                              kind: "feature",
                            });
                          }}
                          style={{
                            border: "none",
                            background: "transparent",
                            color: "#666",
                            cursor: "pointer",
                            padding: 0,
                            display: "grid",
                            placeItems: "center",
                          }}
                          title="Mais opções"
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>


            {createFolderOpen ? (
              <div
                onClick={() => {
                  setCreateFolderOpen(false);
                  setNewFolderName("");
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 4900,
                  background: "rgba(0,0,0,0.18)",
                  display: "grid",
                  placeItems: "center",
                  padding: 12,
                }}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: 290,
                    border: "1px solid #8f8f8f",
                    background: "#cfcfcf",
                    boxShadow: "0 14px 34px rgba(0,0,0,0.30)",
                  }}
                >
                  <div
                    style={{
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 8px",
                      background: "linear-gradient(90deg,#9d00d8,#cf20ff)",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    <span>Adicionar nova pasta</span>

                    <button
                      type="button"
                      onClick={() => {
                        setCreateFolderOpen(false);
                        setNewFolderName("");
                      }}
                      style={headBtn}
                      title="Fechar"
                    >
                      <Square size={11} />
                    </button>
                  </div>

                  <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 12, color: "#444", fontWeight: 700 }}>
                      Nome da pasta
                    </div>

                    <input
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreateFolder();
                        if (e.key === "Escape") {
                          setCreateFolderOpen(false);
                          setNewFolderName("");
                        }
                      }}
                      autoFocus
                      placeholder="Ex: Bairro Nova Petrópolis"
                      style={{
                        height: 30,
                        border: "1px solid #a7a7a7",
                        background: "#efefef",
                        padding: "0 8px",
                        outline: "none",
                        color: "#333",
                        fontSize: 13,
                      }}
                    />

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => {
                          setCreateFolderOpen(false);
                          setNewFolderName("");
                        }}
                        style={modalBtn}
                      >
                        Cancelar
                      </button>

                      <button
                        type="button"
                        onClick={handleCreateFolder}
                        style={{
                          ...modalBtn,
                          fontWeight: 700,
                          boxShadow: "0 0 0 1px rgba(140,0,255,0.15) inset",
                        }}
                      >
                        Criar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {renameFolderId && folderToRename ? (
              <div
                onClick={() => {
                  setRenameFolderId(null);
                  setRenameFolderName("");
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 4900,
                  background: "rgba(0,0,0,0.18)",
                  display: "grid",
                  placeItems: "center",
                  padding: 12,
                }}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: 290,
                    border: "1px solid #8f8f8f",
                    background: "#cfcfcf",
                    boxShadow: "0 14px 34px rgba(0,0,0,0.30)",
                  }}
                >
                  <div
                    style={{
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 8px",
                      background: "linear-gradient(90deg,#9d00d8,#cf20ff)",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    <span>Renomear pasta</span>

                    <button
                      type="button"
                      onClick={() => {
                        setRenameFolderId(null);
                        setRenameFolderName("");
                      }}
                      style={headBtn}
                      title="Fechar"
                    >
                      <Square size={11} />
                    </button>
                  </div>

                  <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 12, color: "#444", fontWeight: 700 }}>
                      Novo nome da pasta
                    </div>

                    <input
                      value={renameFolderName}
                      onChange={(e) => setRenameFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameFolder();
                        if (e.key === "Escape") {
                          setRenameFolderId(null);
                          setRenameFolderName("");
                        }
                      }}
                      autoFocus
                      placeholder="Ex: Pasta Renomeada"
                      style={{
                        height: 30,
                        border: "1px solid #a7a7a7",
                        background: "#efefef",
                        padding: "0 8px",
                        outline: "none",
                        color: "#333",
                        fontSize: 13,
                      }}
                    />

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => {
                          setRenameFolderId(null);
                          setRenameFolderName("");
                        }}
                        style={modalBtn}
                      >
                        Cancelar
                      </button>

                      <button
                        type="button"
                        onClick={handleRenameFolder}
                        style={{
                          ...modalBtn,
                          fontWeight: 700,
                          boxShadow: "0 0 0 1px rgba(140,0,255,0.15) inset",
                        }}
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {movePoleId ? (
              <div
                onClick={() => {
                  setMovePoleId(null);
                  setMovePoleTargetId(null);
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 4900,
                  background: "rgba(0,0,0,0.18)",
                  display: "grid",
                  placeItems: "center",
                  padding: 12,
                }}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: 320,
                    maxHeight: 420,
                    overflow: "hidden",
                    border: "1px solid #8f8f8f",
                    background: "#cfcfcf",
                    boxShadow: "0 14px 34px rgba(0,0,0,0.30)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      height: 28,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 8px",
                      background: "linear-gradient(90deg,#9d00d8,#cf20ff)",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    <span>Mover poste para pasta</span>

                    <button
                      type="button"
                      onClick={() => {
                        setMovePoleId(null);
                        setMovePoleTargetId(null);
                      }}
                      style={headBtn}
                      title="Fechar"
                    >
                      <Square size={11} />
                    </button>
                  </div>

                  <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 12, color: "#444", fontWeight: 700 }}>
                      Escolha a pasta de destino
                    </div>

                    <button
                      type="button"
                      onClick={() => setMovePoleTargetId(null)}
                      style={{
                        textAlign: "left",
                        height: 32,
                        border: movePoleTargetId === null ? "1px solid #8f00ff" : "1px solid #a7a7a7",
                        background: movePoleTargetId === null ? "#ece0ff" : "#efefef",
                        padding: "0 8px",
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                    >
                      Início
                    </button>

                    <div
                      style={{
                        maxHeight: 220,
                        overflow: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      {folders.map((folder) => (
                        <button
                          key={folder.id}
                          type="button"
                          onClick={() => setMovePoleTargetId(folder.id)}
                          style={{
                            textAlign: "left",
                            minHeight: 34,
                            border: movePoleTargetId === folder.id ? "1px solid #8f00ff" : "1px solid #a7a7a7",
                            background: movePoleTargetId === folder.id ? "#ece0ff" : "#efefef",
                            padding: "6px 8px",
                            cursor: "pointer",
                            fontSize: 12,
                            lineHeight: 1.25,
                          }}
                          title={folder.path.join(" / ")}
                        >
                          {folder.path.join(" / ")}
                        </button>
                      ))}
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                      <button
                        type="button"
                        onClick={() => {
                          setMovePoleId(null);
                          setMovePoleTargetId(null);
                        }}
                        style={modalBtn}
                      >
                        Cancelar
                      </button>

                      <button
                        type="button"
                        onClick={handleConfirmMovePole}
                        style={{
                          ...modalBtn,
                          fontWeight: 700,
                          boxShadow: "0 0 0 1px rgba(140,0,255,0.15) inset",
                        }}
                      >
                        Mover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div
              style={{
                height: 22,
                display: "flex",
                alignItems: "center",
                padding: "0 8px",
                borderTop: "1px solid #a7a7a7",
                background: "#c8c8c8",
                fontSize: 12,
                color: "#444",
              }}
            >
              Tipo selecionado para inserção:{" "}
              <b style={{ marginLeft: 4, color: "#7a00cc" }}>Poste redondo</b>
            </div>
          </>
        )}

        {ctx.open ? (
          <div
            style={{
              position: "absolute",
              left: ctx.x - pos.x,
              top: ctx.y - pos.y,
              zIndex: 4800,
              minWidth: 200,
              border: "1px solid #9d9d9d",
              background: "#d1d1d1",
              boxShadow: "0 10px 24px rgba(0,0,0,0.24)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {ctx.kind === "folder" && ctxFolder ? (
              <>
                <CtxBtn
                  label="Abrir"
                  onClick={() => {
                    navigateToPath(ctxFolder.path);
                    setCtx((prev) => ({
                      ...prev,
                      open: false,
                      itemId: null,
                      folderId: null,
                      kind: null,
                    }));
                  }}
                />
                <CtxBtn
                  label="Renomear pasta"
                  onClick={() => {
                    handleOpenRenameFolder(ctxFolder);
                    setCtx((prev) => ({
                      ...prev,
                      open: false,
                      itemId: null,
                      folderId: null,
                      kind: null,
                    }));
                  }}
                />
                <CtxBtn
                  label={folderHasChildren(ctxFolder) ? "Excluir pasta (bloqueado)" : "Excluir pasta"}
                  onClick={() => {
                    if (!folderHasChildren(ctxFolder)) {
                      handleDeleteFolderById(ctxFolder.id);
                    }
                    setCtx((prev) => ({
                      ...prev,
                      open: false,
                      itemId: null,
                      folderId: null,
                      kind: null,
                    }));
                  }}
                />
              </>
            ) : null}

            {ctx.kind === "feature" && ctxItem ? (
              <>
                <CtxBtn
                  label="Abrir notas"
                  onClick={() => {
                    onOpenNotes(ctxItem.id);
                    setCtx((prev) => ({
                      ...prev,
                      open: false,
                      itemId: null,
                      folderId: null,
                      kind: null,
                    }));
                  }}
                />
                <CtxBtn
                  label="Mover para pasta"
                  onClick={() => {
                    setMovePoleId(ctxItem.id);
                    setMovePoleTargetId(currentFolder?.id ?? null);
                    setCtx((prev) => ({
                      ...prev,
                      open: false,
                      itemId: null,
                      folderId: null,
                      kind: null,
                    }));
                  }}
                />
                <CtxBtn
                  label="Renomear"
                  onClick={() => {
                    onRename(ctxItem.id);
                    setCtx((prev) => ({
                      ...prev,
                      open: false,
                      itemId: null,
                      folderId: null,
                      kind: null,
                    }));
                  }}
                />
                <CtxBtn
                  label="Excluir"
                  onClick={() => {
                    onDelete(ctxItem.id);
                    setCtx((prev) => ({
                      ...prev,
                      open: false,
                      itemId: null,
                      folderId: null,
                      kind: null,
                    }));
                  }}
                />
              </>
            ) : null}
          </div>
        ) : null}

        {!minimized ? (
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: 14,
              height: 14,
              cursor: "nwse-resize",
              background:
                "linear-gradient(135deg, transparent 0 35%, #8b8b8b 35% 45%, transparent 45% 60%, #8b8b8b 60% 70%, transparent 70%)",
            }}
          />
        ) : null}
      </div>
    </>
  );
}


function FolderClassicIcon() {
  return (
    <span style={{ position: "relative", width: 16, height: 13, display: "inline-block" }}>
      <span
        style={{
          position: "absolute",
          left: 1,
          top: 0,
          width: 7,
          height: 4,
          border: "1px solid #7d6517",
          borderBottom: "none",
          background: "linear-gradient(180deg,#f9e28a,#dcb74c)",
          boxSizing: "border-box",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)",
        }}
      />
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 3,
          width: 16,
          height: 10,
          border: "1px solid #7d6517",
          background: "linear-gradient(180deg,#f7dc7a,#c79d2e)",
          boxSizing: "border-box",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(120,90,10,0.18)",
        }}
      />
      <span
        style={{
          position: "absolute",
          left: 1,
          top: 4,
          width: 14,
          height: 1,
          background: "rgba(255,255,255,0.22)",
        }}
      />
    </span>
  );
}

function CtxBtn({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        height: 32,
        border: "none",
        borderBottom: "1px solid #b5b5b5",
        background: "#d7d7d7",
        color: "#333",
        textAlign: "left",
        padding: "0 10px",
        cursor: "pointer",
        fontSize: 13,
      }}
    >
      {label}
    </button>
  );
}

const headBtn: React.CSSProperties = {
  width: 18,
  height: 18,
  border: "1px solid rgba(255,255,255,0.35)",
  background: "rgba(255,255,255,0.10)",
  color: "white",
  cursor: "pointer",
  padding: 0,
  display: "grid",
  placeItems: "center",
};

const miniToolbarBtn: React.CSSProperties = {
  border: "none",
  background: "transparent",
  color: "#555",
  cursor: "pointer",
  padding: 0,
  fontSize: 14,
  lineHeight: 1,
};

const modalBtn: React.CSSProperties = {
  minWidth: 78,
  height: 28,
  border: "1px solid #9b9b9b",
  background: "#dddddd",
  color: "#333",
  cursor: "pointer",
  padding: "0 10px",
};
