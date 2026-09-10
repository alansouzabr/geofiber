import { useState } from "react";

export function useTool() {
  const [activeTool, setActiveTool] = useState("select");

  function setTool(tool: string) {
    setActiveTool(tool);
  }

  return {
    activeTool,
    setTool,
  };
}
