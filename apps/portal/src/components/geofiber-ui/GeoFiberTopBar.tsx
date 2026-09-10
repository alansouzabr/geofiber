"use client";

import React, { useEffect, useState } from "react";
import { getMe } from "@/services/auth";
import {
  Search,
  LogOut,
  Menu,
  Layers,
  Crosshair,
  Palette,
  FolderTree,
} from "lucide-react";
import GeoFiberSystemMenu from "./GeoFiberSystemMenu";
import AddressSearchModal from "./AddressSearchModal";
import GeoFiberThemePanel from "./GeoFiberThemePanel";
import GeoFiberFoldersPanel from "./GeoFiberFoldersPanel";
import { logoutPortal } from "@/lib/logout";
import type { BaseLayer } from "@/components/geofiber-map/MapLayers";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onLogout?: () => void | Promise<void>;
  projectLabel?: string;
  baseLayer: BaseLayer;
  onBaseLayerChange: (v: BaseLayer) => void;
};

export default function GeoFiberTopBar({
  value,
  onChange,
  onLogout,
  projectLabel = "GeoFiber Maps",
  baseLayer,
  onBaseLayerChange,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userLabel, setUserLabel] = useState("Usuário");
  const [companyLabel, setCompanyLabel] = useState("Empresa");
  const [themeOpen, setThemeOpen] = useState(false);
  const [foldersOpen, setFoldersOpen] = useState(false);


  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const me = await getMe();
        if (!alive) return;

        const label =
          me?.name ||
          me?.fullName ||
          me?.email ||
          "Usuário";

        const company =
          me?.company?.name ||
          me?.companyId ||
          "Empresa";

        setUserLabel(String(label));
        setCompanyLabel(String(company));
      } catch (err) {
        console.error("Erro ao carregar usuário logado:", err);
        if (!alive) return;
        setUserLabel("Usuário");
        setCompanyLabel("Empresa");
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    function openSearch() {
      setSearchOpen(true);
    }
    function toggleFolders() {
      setFoldersOpen((v) => !v);
    }
    function toggleTheme() {
      setThemeOpen((v) => !v);
    }

    window.addEventListener("gf:open-address-search", openSearch as EventListener);
    window.addEventListener("gf:toggle-folders", toggleFolders as EventListener);
    window.addEventListener("gf:toggle-theme", toggleTheme as EventListener);

    return () => {
      window.removeEventListener("gf:open-address-search", openSearch as EventListener);
      window.removeEventListener("gf:toggle-folders", toggleFolders as EventListener);
      window.removeEventListener("gf:toggle-theme", toggleTheme as EventListener);
    };
  }, []);

  const logout = async () => {
    if (onLogout) {
      await onLogout();
      return;
    }
    await logoutPortal();
  };

  return (
    <>
      <div style={wrap}>
        <div style={left}>
          <div style={brand}>
            <div style={logoOrb}>
              <div style={logoRing}></div>
              <div style={logoDot}></div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.02 }}>
              <div style={brandTitle}>{`Bem-vindo ${userLabel}`}</div>
              <div style={brandSub}>{companyLabel}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            style={searchWrap}
            title="Buscar endereço"
          >
            <Search size={18} style={{ opacity: 0.9, flexShrink: 0 }} />
            <span style={searchText}>
              {value?.trim() ? value : "Buscar endereço"}
            </span>
          </button>

          <div style={pill} title="Projeto / Área">
            <span style={{ opacity: 0.95 }}>📍</span>
            <span style={{ fontWeight: 800 }}>{projectLabel}</span>
          </div>

          <div style={tools}>
            <button style={toolBtn} title="OSM" onClick={() => onBaseLayerChange("osm")}>
              <span style={toolBtnTextActive(baseLayer === "osm")}>OSM</span>
            </button>

            <button
              style={toolBtn}
              title="Satélite"
              onClick={() => onBaseLayerChange("satellite")}
            >
              <span style={toolBtnTextActive(baseLayer === "satellite")}>Satélite</span>
            </button>

            <button style={toolBtn} title="Centralizar">
              <Crosshair size={18} />
            </button>
            <button style={toolBtn} title="Camadas">
              <Layers size={18} />
            </button>
            <button style={toolBtn} title="Pastas" onClick={() => setFoldersOpen((v) => !v)}>
              <FolderTree size={18} />
            </button>
            <button style={toolBtn} title="Paleta" onClick={() => setThemeOpen((v) => !v)}>
              <Palette size={18} />
            </button>
          </div>
        </div>

        <div style={right}>
          <button style={iconBtn} title="Menu" onClick={() => setMenuOpen(true)}>
            <Menu size={18} />
            <span style={{ fontWeight: 800 }}>Menu</span>
          </button>

          <button style={iconBtn} title="Sair" onClick={logout}>
            <LogOut size={18} />
            <span style={{ fontWeight: 800 }}>Sair</span>
          </button>
        </div>
      </div>

      <AddressSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      <GeoFiberFoldersPanel open={foldersOpen} onClose={() => setFoldersOpen(false)} />
      <GeoFiberThemePanel open={themeOpen} onClose={() => setThemeOpen(false)} />
      <GeoFiberSystemMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

const wrap: React.CSSProperties = {
  position: "absolute",
  top: 6,
  left: 6,
  right: 6,
  height: 58,
  zIndex: 5000,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 12px",
  background:
    "linear-gradient(90deg, var(--gf-primary,#8a009f) 0%, var(--gf-secondary,#8b10bc) 48%, var(--gf-primary,#6f0aa0) 100%)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 14,
  boxShadow: "0 14px 34px rgba(0,0,0,0.28)",
  backdropFilter: "blur(8px)",
};

const left: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  minWidth: 0,
};

const right: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const brand: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: "white",
  padding: "6px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.14)",
  minWidth: 150,
};

const logoOrb: React.CSSProperties = {
  position: "relative",
  width: 34,
  height: 34,
  borderRadius: 999,
  background: "radial-gradient(circle at 30% 30%, var(--gf-accent,#29f0ff), #1ca3ff 55%, #0c5ad8 100%)",
  boxShadow: "0 0 18px rgba(41,240,255,0.35)",
  flexShrink: 0,
};

const logoRing: React.CSSProperties = {
  position: "absolute",
  inset: 7,
  borderRadius: 999,
  border: "2px solid rgba(255,255,255,0.8)",
  opacity: 0.75,
};

const logoDot: React.CSSProperties = {
  position: "absolute",
  right: 5,
  top: 5,
  width: 6,
  height: 6,
  borderRadius: 999,
  background: "#fff",
};

const brandTitle: React.CSSProperties = { fontSize: 16, fontWeight: 900, color: "#fff" };
const brandSub: React.CSSProperties = { fontSize: 11, opacity: 0.95, fontWeight: 700, color: "#dff8ff" };

const searchWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 12px",
  width: 360,
  maxWidth: "38vw",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.14)",
  color: "white",
  cursor: "pointer",
  textAlign: "left",
};

const searchText: React.CSSProperties = {
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: "white",
  fontSize: 14,
  fontWeight: 700,
};

const pill: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.16)",
  background: "rgba(0,0,0,0.14)",
  color: "white",
};

const tools: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const toolBtn: React.CSSProperties = {
  minWidth: 40,
  height: 40,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(0,0,0,0.14)",
  color: "white",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
  padding: "0 10px",
};

const toolBtnTextActive = (active: boolean): React.CSSProperties => ({
  fontSize: 12,
  fontWeight: 800,
  opacity: active ? 1 : 0.82,
});

const iconBtn: React.CSSProperties = {
  height: 40,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(0,0,0,0.14)",
  color: "white",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
  padding: "0 14px",
};