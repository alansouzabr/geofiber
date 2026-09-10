"use client";

import React, { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

type TabKey = "cep_numero" | "coordenadas";

function clean(v: string) {
  return String(v || "").trim();
}

export default function AddressSearchModal({ open, onClose }: Props) {
  const [tab, setTab] = useState<TabKey>("cep_numero");

  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const canSearchCep = useMemo(() => clean(cep).length >= 8 || clean(numero).length > 0, [cep, numero]);
  const canSearchCoords = useMemo(() => clean(lat) !== "" && clean(lng) !== "", [lat, lng]);

  function resetForm() {
    setCep("");
    setNumero("");
    setComplemento("");
    setLat("");
    setLng("");
  }

  function dispatchCepSearch() {
    const payload = {
      mode: "cep_numero",
      cep: clean(cep),
      number: clean(numero),
      complemento: clean(complemento),
    };

    window.dispatchEvent(
      new CustomEvent("gf:address-search", {
        detail: payload,
      })
    );

    onClose();
  }

  function dispatchCoordsSearch() {
    const payload = {
      mode: "coords",
      lat: clean(lat),
      lng: clean(lng),
    };

    window.dispatchEvent(
      new CustomEvent("gf:address-search", {
        detail: payload,
      })
    );

    onClose();
  }

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 5000,
        background: "rgba(0,0,0,0.18)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: 8,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 320,
          borderRadius: 14,
          overflow: "hidden",
          background: "#cfcfcf",
          boxShadow: "0 12px 30px rgba(0,0,0,0.32)",
          border: "1px solid rgba(255,255,255,0.20)",
        }}
      >
        <div
          style={{
            height: 42,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 10px",
            background: "linear-gradient(90deg,#91009a,#c41acb)",
            color: "#fff",
          }}
        >
          <Search size={18} />
          <input
            value={tab === "cep_numero" ? cep : `${lat}${lat && lng ? ", " : ""}${lng}`}
            onChange={(e) => {
              if (tab === "cep_numero") setCep(e.target.value);
            }}
            placeholder="Buscar endereço"
            style={{
              flex: 1,
              height: 30,
              border: "1px solid rgba(255,255,255,0.22)",
              background: "rgba(255,255,255,0.12)",
              color: "#fff",
              borderRadius: 8,
              outline: "none",
              padding: "0 10px",
              fontSize: 14,
            }}
          />
          <button
            type="button"
            onClick={onClose}
            title="Fechar"
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.12)",
              color: "#fff",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ display: "flex", background: "#dfdfdf", borderBottom: "1px solid #b7b7b7" }}>
          <button
            type="button"
            onClick={() => setTab("cep_numero")}
            style={{
              flex: 1,
              height: 36,
              border: 0,
              cursor: "pointer",
              fontWeight: 700,
              color: "#444",
              background: tab === "cep_numero" ? "#f2f2f2" : "#d9d9d9",
            }}
          >
            CEP + Número
          </button>
          <button
            type="button"
            onClick={() => setTab("coordenadas")}
            style={{
              flex: 1,
              height: 36,
              border: 0,
              cursor: "pointer",
              fontWeight: 700,
              color: "#444",
              background: tab === "coordenadas" ? "#f2f2f2" : "#d9d9d9",
            }}
          >
            Coordenadas
          </button>
        </div>

        <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          {tab === "cep_numero" ? (
            <>
              <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#444" }}>CEP</span>
                <input
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="Ex: 09050-000"
                  style={inputStyle}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#444" }}>Número</span>
                <input
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="Ex: 123"
                  style={inputStyle}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#444" }}>Complemento (opcional)</span>
                <input
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                  placeholder="Bloco, apto, casa fundos..."
                  style={inputStyle}
                />
              </label>
            </>
          ) : (
            <>
              <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#444" }}>Latitude</span>
                <input
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="Ex: -23.691078"
                  style={inputStyle}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#444" }}>Longitude</span>
                <input
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder="Ex: -46.562731"
                  style={inputStyle}
                />
              </label>
            </>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 8 }}>
            <button type="button" onClick={resetForm} style={btnSecondary}>
              Limpar
            </button>

            <button
              type="button"
              disabled={tab === "cep_numero" ? !canSearchCep : !canSearchCoords}
              onClick={() => {
                if (tab === "cep_numero") dispatchCepSearch();
                else dispatchCoordsSearch();
              }}
              style={{
                ...btnPrimary,
                opacity: tab === "cep_numero" ? (canSearchCep ? 1 : 0.55) : (canSearchCoords ? 1 : 0.55),
                cursor: tab === "cep_numero" ? (canSearchCep ? "pointer" : "not-allowed") : (canSearchCoords ? "pointer" : "not-allowed"),
              }}
            >
              Pesquisar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  height: 32,
  border: "1px solid #bababa",
  background: "#efefef",
  borderRadius: 8,
  outline: "none",
  padding: "0 10px",
  color: "#333",
  fontSize: 14,
};

const btnSecondary: React.CSSProperties = {
  minWidth: 90,
  height: 34,
  border: "1px solid #b0b0b0",
  background: "#ededed",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 700,
  color: "#444",
};

const btnPrimary: React.CSSProperties = {
  minWidth: 90,
  height: 34,
  border: "1px solid #b0b0b0",
  background: "#dedede",
  borderRadius: 8,
  fontWeight: 700,
  color: "#666",
};