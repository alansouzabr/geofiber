"use client";

import { useTool } from "@/modules/tools/useTool";

type Tool = {
  id: "select" | "pole" | "fiber" | "box";
  icon: string;
};

const tools: Tool[] = [
  { id: "select", icon: "🖱️" },
  { id: "pole", icon: "📍" },
  { id: "fiber", icon: "🧵" },
  { id: "box", icon: "📦" },
];

export default function Toolbar() {
  const { activeTool, setTool } = useTool();

  return (
    <div style={container}>
      {tools.map((tool) => {
        const active = activeTool === tool.id;

        return (
          <button
            key={tool.id}
            onClick={() => setTool(tool.id)}
            style={{
              ...btn,
              background: active ? "#2563eb" : "#111827",
              boxShadow: active
                ? "0 0 0 2px #3b82f6"
                : "none",
            }}
          >
            {tool.icon}
          </button>
        );
      })}
    </div>
  );
}

const container: React.CSSProperties = {
  position: "absolute",
  left: 20,
  top: 120,
  display: "flex",
  flexDirection: "column",
  gap: 12,
  zIndex: 9999,
};

const btn: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 12,
  border: "none",
  color: "white",
  cursor: "pointer",
  fontSize: 18,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
};
