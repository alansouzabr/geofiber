"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Feature } from "@/components/geofiber-map/editor/types";

export type PolePreset = "redondo";
export type MapTool = "select" | "add_pole" | "add_cto" | "add_box" | "add_note";

function getNextPoleName(features: Feature[]) {
  const usedNumbers = features
    .filter((f) => f.type === "pole")
    .map((f) => String(f.name || ""))
    .map((name) => {
      const m = name.match(/^Poste\s+(\d{3})$/i);
      return m ? Number(m[1]) : null;
    })
    .filter((n): n is number => n !== null)
    .sort((a, b) => a - b);

  let next = 1;
  for (const n of usedNumbers) {
    if (n === next) next++;
    else if (n > next) break;
  }

  return `Poste ${String(next).padStart(3, "0")}`;
}

export function usePoleTool(features: Feature[]) {
  const [activeTool, setActiveTool] = useState<MapTool>("select");
  const [polePreset, setPolePreset] = useState<PolePreset>("redondo");

  const addPoleModeActive = activeTool === "add_pole";

  const mapCursor = useMemo(
    () => (addPoleModeActive ? "crosshair" : "default"),
    [addPoleModeActive]
  );

  const nextPoleName = useMemo(() => getNextPoleName(features), [features]);

  const activateAddPole = useCallback((preset: PolePreset = "redondo") => {
    setPolePreset(preset);
    setActiveTool("add_pole");
  }, []);

  const deactivateAddPole = useCallback(() => {
    setActiveTool("select");
  }, []);

  const toggleAddPoleMode = useCallback((preset: PolePreset = "redondo") => {
    setPolePreset(preset);
    setActiveTool((cur) => (cur === "add_pole" ? "select" : "add_pole"));
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActiveTool("select");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return {
    activeTool,
    setActiveTool,
    polePreset,
    setPolePreset,
    addPoleModeActive,
    mapCursor,
    nextPoleName,
    activateAddPole,
    deactivateAddPole,
    toggleAddPoleMode,
  };
}