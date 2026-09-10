"use client";

import React, { useEffect, useState } from "react";
import { Palette, RotateCcw, Check } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

type ThemeState = {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
};

const DEFAULTS: ThemeState = {
  primary: "#8f008f",
  secondary: "#a90097",
  accent: "#28d7ff",
  bg: "#07141d",
};

function applyTheme(t: ThemeState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--gf-primary", t.primary);
  root.style.setProperty("--gf-secondary", t.secondary);
  root.style.setProperty("--gf-accent", t.accent);
  root.style.setProperty("--gf-bg", t.bg);
}

export default function GeoFiberThemePanel({ open, onClose }: Props) {
  const [theme, setTheme] = useState<ThemeState>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("gf_theme");
      if (raw) {
        const saved = JSON.parse(raw);
        const merged = { ...DEFAULTS, ...saved };
        setTheme(merged);
        applyTheme(merged);
        return;
      }
    } catch {}
    applyTheme(DEFAULTS);
  }, []);

  if (!open) return null;

  function patch<K extends keyof ThemeState>(key: K, value: ThemeState[K]) {
    const next = { ...theme, [key]: value };
    setTheme(next);
    applyTheme(next);
  }

  function save() {
    try {
      localStorage.setItem("gf_theme", JSON.stringify(theme));
    } catch {}
    onClose();
  }

  function reset() {
    setTheme(DEFAULTS);
    applyTheme(DEFAULTS);
    try {
      localStorage.setItem("gf_theme", JSON.stringify(DEFAULTS));
    } catch {}
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 74,
        right: 14,
        zIndex: 9100,
        width: 310,
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
        background: "#15151a",
        color: "white",
      }}
    >
      <div
        style={{
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          background: "linear-gradient(90deg,var(--gf-primary,#8f008f),var(--gf-secondary,#a90097))",
          borderBottom: "1px solid rgba(255,255,255,0.14)",
          fontWeight: 900,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Palette size={16} />
          Paleta do Dashboard
        </span>

        <button
          type="button"
          onClick={onClose}
          style={closeBtn}
        >
          ×
        </button>
      </div>

      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        <ColorField
          label="Cor primária"
          value={theme.primary}
          onChange={(v) => patch("primary", v)}
        />
        <ColorField
          label="Cor secundária"
          value={theme.secondary}
          onChange={(v) => patch("secondary", v)}
        />
        <ColorField
          label="Cor de destaque"
          value={theme.accent}
          onChange={(v) => patch("accent", v)}
        />
        <ColorField
          label="Fundo base"
          value={theme.bg}
          onChange={(v) => patch("bg", v)}
        />

        <div
          style={{
            marginTop: 6,
            height: 64,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            background: `linear-gradient(90deg, ${theme.primary}), ${theme.secondary})`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 10,
              top: 10,
              width: 18,
              height: 18,
              borderRadius: 999,
              background: theme.accent,
              boxShadow: `0 0 18px ${theme.accent}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 10,
              bottom: 10,
              width: 90,
              height: 18,
              borderRadius: 999,
              background: "rgba(255,255,255,0.16)",
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 4 }}>
          <button type="button" onClick={reset} style={ghostBtn}>
            <RotateCcw size={15} />
            Restaurar
          </button>

          <button type="button" onClick={save} style={saveBtn}>
            <Check size={15} />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12 }}>
      <span style={{ opacity: 0.9 }}>{label}</span>
      <div style={{ display: "grid", gridTemplateColumns: "42px 1fr", gap: 8 }}>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 42,
            height: 34,
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 8,
            background: "transparent",
            padding: 2,
          }}
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#8f008f"
          style={{
            height: 34,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.06)",
            color: "white",
            padding: "0 10px",
            outline: "none",
            fontWeight: 700,
          }}
        />
      </div>
    </label>
  );
}

const closeBtn: React.CSSProperties = {
  width: 24,
  height: 24,
  borderRadius: 6,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(0,0,0,0.18)",
  color: "white",
  cursor: "pointer",
};

const ghostBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  minWidth: 110,
  height: 36,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  cursor: "pointer",
};

const saveBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  minWidth: 110,
  height: 36,
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "linear-gradient(90deg,var(--gf-primary,#8f008f),var(--gf-secondary,#a90097))",
  color: "white",
  cursor: "pointer",
  fontWeight: 800,
};