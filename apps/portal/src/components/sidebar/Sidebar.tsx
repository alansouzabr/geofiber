"use client";

import { useState } from "react";

const items = [
  { id: "map", icon: "🗺️" },
  { id: "nodes", icon: "📍" },
  { id: "layers", icon: "🧱" },
  { id: "users", icon: "👤" },
];

export default function Sidebar() {
  const [active, setActive] = useState("map");

  return (
    <div style={{
      position: "absolute",
      left: 10,
      top: 80,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      zIndex: 9999
    }}>
      {items.map(item => (
        <div
          key={item.id}
          onClick={() => setActive(item.id)}
          style={{
            width: 50,
            height: 50,
            background: active === item.id ? "#2563eb" : "#1f2937",
            color: "white",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
}
