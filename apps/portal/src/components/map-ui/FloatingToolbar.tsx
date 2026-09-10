"use client";

import { useTool } from "@/modules/tools/useTool";

const tools = [
  { id: "select", icon: "🖱️" },
  { id: "pole", icon: "📍" },
  { id: "fiber", icon: "🧵" },
  { id: "box", icon: "📦" },
];

export default function FloatingToolbar() {
  const { activeTool, setTool } = useTool();

  return (
    <div
      style={{
        position: "absolute",
        left: 20,
        top: 120,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        zIndex: 9999,
      }}
    >
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => setTool(tool.id as any)}
          style={{
            width: 45,
            height: 45,
            borderRadius: 10,
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: 18,
            background:
              activeTool === tool.id ? "#2563eb" : "#111827",
          }}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
}
