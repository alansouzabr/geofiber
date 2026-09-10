"use client";

import React, { useState } from "react";

type Props = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export default function FloatingPanel({
  title,
  children,
  defaultOpen = true,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        position: "absolute",
        top: 120,
        left: 40,
        width: open ? 300 : 180,
        background: "rgba(20,20,20,0.85)",
        backdropFilter: "blur(10px)",
        borderRadius: 12,
        color: "white",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 12px",
          background: "linear-gradient(90deg,#7a00ff,#b100ff)",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        {title}

        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => setOpen(!open)}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            {open ? "➖" : "➕"}
          </button>
        </div>
      </div>

      {open && (
        <div
          style={{
            padding: 12,
            fontSize: 13,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}