"use client";

import React, { useMemo, useState } from "react";
import type { Feature } from "./types";

export default function LeftPanel({
  features,
  selectedId,
  setSelectedId,
  updateFeature,
}: {
  features: Feature[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  updateFeature: (id: string, patch: Partial<Feature>) => void;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return features;
    return features.filter(
      (f) =>
        (f.name || "").toLowerCase().includes(s) ||
        f.type.toLowerCase().includes(s) ||
        (f.notes || "").toLowerCase().includes(s)
    );
  }, [q, features]);

  const groups = useMemo(() => {
    const g: Record<string, Feature[]> = {};
    for (const f of filtered) {
      g[f.type] ||= [];
      g[f.type].push(f);
    }
    return g;
  }, [filtered]);

  const selected = useMemo(() => features.find((f) => f.id === selectedId) || null, [features, selectedId]);

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 1200,
        left: 16,
        top: 16,
        width: 360,
        maxHeight: "calc(100vh - 32px)",
        overflow: "hidden",
        borderRadius: 14,
        background: "rgba(10,12,18,0.80)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(10px)",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: 12, borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
        <div style={{ fontWeight: 900, fontSize: 14 }}>GeoFiber Editor</div>
        <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>Cadastro + anotações internas (estilo GeoGrid)</div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar (nome, tipo, notas)..."
          style={{
            marginTop: 10,
            width: "100%",
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
            color: "white",
            outline: "none",
          }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", overflow: "auto" }}>
        <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.entries(groups).map(([type, list]) => (
            <div key={type}>
              <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 900, margin: "6px 4px" }}>
                {type.toUpperCase()} ({list.length})
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {list.map((f) => {
                  const isSel = f.id === selectedId;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedId(f.id)}
                      style={{
                        textAlign: "left",
                        padding: "10px 10px",
                        borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.10)",
                        background: isSel ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.06)",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontWeight: 900 }}>{f.name || "(sem nome)"}</div>
                      <div style={{ fontSize: 12, opacity: 0.75 }}>{f.id}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)", padding: 12 }}>
          {!selected ? (
            <div style={{ fontSize: 12, opacity: 0.75 }}>
              Selecione um item para ver propriedades.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 950 }}>{selected.type.toUpperCase()}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{selected.id}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: "rgba(255,255,255,0.06)",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Fechar
                </button>
              </div>

              <label style={{ fontSize: 12, opacity: 0.8, fontWeight: 800 }}>Nome</label>
              <input
                value={selected.name || ""}
                onChange={(e) => updateFeature(selected.id, { name: e.target.value } as any)}
                placeholder="Ex: CTO 1x8, Poste 123..."
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  color: "white",
                  outline: "none",
                }}
              />

              <label style={{ fontSize: 12, opacity: 0.8, fontWeight: 800 }}>Notas internas</label>
              <textarea
                value={selected.notes || ""}
                onChange={(e) => updateFeature(selected.id, { notes: e.target.value } as any)}
                placeholder="Observações, pendências, identificação da equipe..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  color: "white",
                  outline: "none",
                  resize: "vertical",
                }}
              />

              <div style={{ fontSize: 11, opacity: 0.65 }}>
                Próximo passo: anexos, diagrama do splitter, portas, capacidade, status e auditoria.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}