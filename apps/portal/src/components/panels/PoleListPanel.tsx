"use client";

import { usePoles } from "@/modules/poles/usePoles";

export default function PoleListPanel() {
  const { poles, selectedId, selectPole } = usePoles();

  return (
    <div style={{
      position: "absolute",
      left: 80,
      top: 120,
      width: 260,
      background: "#111827cc",
      backdropFilter: "blur(10px)",
      color: "white",
      borderRadius: 10,
      padding: 10,
      zIndex: 9999
    }}>
      <strong>Postes ({poles.length})</strong>

      <div style={{ marginTop: 10 }}>
        {poles.map(p => (
          <div
            key={p.id}
            onClick={() => selectPole(p.id)}
            style={{
              padding: 6,
              borderRadius: 6,
              cursor: "pointer",
              background: selectedId === p.id ? "#2563eb" : "transparent"
            }}
          >
            📍 Poste {p.id.slice(-4)}
          </div>
        ))}
      </div>
    </div>
  );
}
