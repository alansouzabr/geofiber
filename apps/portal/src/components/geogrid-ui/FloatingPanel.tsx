"use client";

import React, { useEffect, useMemo, useRef } from "react";

type Props = {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;

  x: number;
  y: number;
  w: number;
  h: number;

  z: number;
  locked: boolean;
  maximized: boolean;
  minimized: boolean;

  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;

  onToggleMinimize: (id: string) => void;
  onToggleMaximize: (id: string) => void;
  onToggleLock: (id: string) => void;
  onClose: (id: string) => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function FloatingPanel({
  id,
  title,
  icon,
  children,
  x,
  y,
  w,
  h,
  z,
  locked,
  maximized,
  minimized,
  onFocus,
  onMove,
  onToggleMinimize,
  onToggleMaximize,
  onToggleLock,
  onClose,
}: Props) {
  const drag = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    baseX: 0,
    baseY: 0,
  });

  if (minimized) return null;

  const panelStyle = useMemo(() => {
    if (maximized) {
      return {
        position: "absolute" as const,
        inset: 12,
        width: "calc(100% - 24px)",
        height: "calc(100% - 24px)",
      };
    }
    return {
      position: "absolute" as const,
      left: x,
      top: y,
      width: w,
      height: h,
    };
  }, [maximized, x, y, w, h]);

  function focus() {
    onFocus(id);
  }

  function onHeaderPointerDown(e: React.PointerEvent) {
    if (locked || maximized) return;
    focus();

    drag.current.dragging = true;
    drag.current.startX = e.clientX;
    drag.current.startY = e.clientY;
    drag.current.baseX = x;
    drag.current.baseY = y;

    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    e.preventDefault();
  }

  useEffect(() => {
    function onMoveWin(ev: PointerEvent) {
      if (!drag.current.dragging) return;

      const dx = ev.clientX - drag.current.startX;
      const dy = ev.clientY - drag.current.startY;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const nx = clamp(drag.current.baseX + dx, 8, Math.max(8, vw - w - 8));
      const ny = clamp(drag.current.baseY + dy, 60, Math.max(60, vh - h - 8));

      onMove(id, nx, ny);
    }

    function onUp() {
      drag.current.dragging = false;
    }

    window.addEventListener("pointermove", onMoveWin, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMoveWin);
      window.removeEventListener("pointerup", onUp);
    };
  }, [h, id, onMove, w]);

  return (
    <div
      data-panel-id={id}
      onPointerDown={focus}
      style={{
        ...panelStyle,
        zIndex: z,
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(15, 15, 18, 0.78)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 18px 45px rgba(0,0,0,0.45)",
        color: "white",
      }}
    >
      <div
        onPointerDown={onHeaderPointerDown}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 10px",
          background: "linear-gradient(90deg,#7a00ff,#b100ff)",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          cursor: locked || maximized ? "default" : "grab",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 900 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 26,
              height: 26,
              borderRadius: 10,
              background: "rgba(255,255,255,0.16)",
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            {icon ?? "◉"}
          </span>
          <span style={{ fontSize: 13 }}>{title}</span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={() => onToggleMinimize(id)} title="Minimizar" style={miniBtnStyle}>
            _
          </button>

          <button
            type="button"
            onClick={() => onToggleMaximize(id)}
            title={maximized ? "Restaurar" : "Maximizar"}
            style={miniBtnStyle}
          >
            +
          </button>

          <button
            type="button"
            onClick={() => onToggleLock(id)}
            title={locked ? "Destravar" : "Travar"}
            style={miniBtnStyle}
          >
            {locked ? "🔒" : "🔓"}
          </button>

          <button
            type="button"
            onClick={() => onClose(id)}
            title="Fechar"
            style={{ ...miniBtnStyle, background: "rgba(0,0,0,0.18)" }}
          >
            ✕
          </button>
        </div>
      </div>

      <div
        style={{
          height: "calc(100% - 48px)",
          padding: 12,
          overflow: "auto",
          fontSize: 13,
        }}
      >
        {children}
      </div>
    </div>
  );
}

const miniBtnStyle: React.CSSProperties = {
  width: 34,
  height: 28,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(0,0,0,0.18)",
  color: "white",
  fontWeight: 900,
  cursor: "pointer",
  lineHeight: "28px",
};