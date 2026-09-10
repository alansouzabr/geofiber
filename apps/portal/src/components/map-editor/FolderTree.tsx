"use client";

import { useState } from "react";

export default function FolderTree() {
  const [selected, setSelected] = useState("Projeto Principal");

  const data = [
    {
      name: "Projeto Principal",
      children: ["Postes", "Caixas", "Clientes"]
    }
  ];

  return (
    <div style={{
      position: "absolute",
      left: 80,
      top: 140,
      background: "#111827",
      color: "white",
      padding: 10,
      borderRadius: 10,
      width: 220,
      zIndex: 9999
    }}>
      {data.map(folder => (
        <div key={folder.name}>
          <div
            onClick={() => setSelected(folder.name)}
            style={{
              padding: 6,
              background: selected === folder.name ? "#2563eb" : "transparent",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            📁 {folder.name}
          </div>

          <div style={{ marginLeft: 10 }}>
            {folder.children.map(child => (
              <div
                key={child}
                onClick={() => setSelected(child)}
                style={{
                  padding: 6,
                  background: selected === child ? "#2563eb" : "transparent",
                  borderRadius: 6,
                  cursor: "pointer"
                }}
              >
                📄 {child}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
