"use client";

import React, { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import type { Feature } from "@/components/geofiber-map/editor/types";

type PosteFormData = {
  numero: string;
  rotuloMapa: string;
  endereco: string;
  numeroEndereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  complemento: string;
  latitude: string;
  longitude: string;
  observacoes: string;
};

type Props = {
  open: boolean;
  feature: Feature | null;
  onClose: () => void;
  onSave: (id: string, patch: Partial<Feature>) => void;
};

const EMPTY_FORM: PosteFormData = {
  numero: "",
  rotuloMapa: "",
  endereco: "",
  numeroEndereco: "",
  bairro: "",
  cidade: "São Bernardo do Campo",
  estado: "SP",
  cep: "",
  complemento: "",
  latitude: "",
  longitude: "",
  observacoes: "",
};

function readPayload(notes?: string): Partial<PosteFormData> {
  if (!notes) return {};
  try {
    const parsed = JSON.parse(notes);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

export default function GeoFiberPosteFormModal({
  open,
  feature,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<PosteFormData>(EMPTY_FORM);

  useEffect(() => {
    if (!open || !feature) return;

    const payload = readPayload(feature.notes);
    setForm({
      numero: String(payload.numero || ""),
      rotuloMapa: String(payload.rotuloMapa || feature.name || ""),
      endereco: String(payload.endereco || ""),
      numeroEndereco: String(payload.numeroEndereco || ""),
      bairro: String(payload.bairro || ""),
      cidade: String(payload.cidade || "São Bernardo do Campo"),
      estado: String(payload.estado || "SP"),
      cep: String(payload.cep || ""),
      complemento: String(payload.complemento || ""),
      latitude: String(payload.latitude || (typeof (feature as any).lat === "number" ? (feature as any).lat : "")),
      longitude: String(payload.longitude || (typeof (feature as any).lng === "number" ? (feature as any).lng : "")),
      observacoes: String(payload.observacoes || ""),
    });
  }, [open, feature]);

  if (!open || !feature) return null;

  function patch<K extends keyof PosteFormData>(key: K, value: PosteFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    if (!feature) return;

    const latNum = Number(String(form.latitude || "").replace(",", "."));
    const lngNum = Number(String(form.longitude || "").replace(",", "."));

    const payload: PosteFormData = {
      ...form,
    };

    onSave(feature.id, {
      name: form.rotuloMapa || "Poste redondo",
      notes: JSON.stringify(payload, null, 2),
      ...(Number.isFinite(latNum) ? { lat: latNum } : {}),
      ...(Number.isFinite(lngNum) ? { lng: lngNum } : {}),
    } as any);

    onClose();
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 7000,
        background: "rgba(0,0,0,0.28)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div
        style={{
          width: "min(820px, calc(100vw - 30px))",
          maxHeight: "calc(100vh - 30px)",
          overflow: "auto",
          borderRadius: 16,
          border: "4px solid #a000b3",
          background: "#cfcfcf",
          boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 10px",
            background: "linear-gradient(90deg,#8d0097,#a90db8)",
            color: "white",
            fontWeight: 800,
          }}
        >
          <span>Poste</span>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: 24,
              height: 24,
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.12)",
              color: "white",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              padding: 0,
            }}
            title="Fechar"
          >
            <X size={14} />
          </button>
        </div>

        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={row2}>
            <Field label="Número">
              <input value={form.numero} onChange={(e) => patch("numero", e.target.value)} style={input} />
            </Field>
            <Field label="Rótulo no mapa">
              <input value={form.rotuloMapa} onChange={(e) => patch("rotuloMapa", e.target.value)} style={input} />
            </Field>
          </div>

          <div style={rowAddress}>
            <Field label="Endereço">
              <input value={form.endereco} onChange={(e) => patch("endereco", e.target.value)} style={input} />
            </Field>
            <Field label="Nº">
              <input value={form.numeroEndereco} onChange={(e) => patch("numeroEndereco", e.target.value)} style={input} />
            </Field>
          </div>

          <div style={row3}>
            <Field label="Bairro">
              <input value={form.bairro} onChange={(e) => patch("bairro", e.target.value)} style={input} />
            </Field>
            <Field label="CEP">
              <input value={form.cep} onChange={(e) => patch("cep", e.target.value)} style={input} />
            </Field>
          </div>

          <div style={row3}>
            <Field label="Cidade">
              <input value={form.cidade} onChange={(e) => patch("cidade", e.target.value)} style={input} />
            </Field>
            <Field label="Estado">
              <input value={form.estado} onChange={(e) => patch("estado", e.target.value)} style={input} />
            </Field>
          </div>

          <Field label="Compl.">
            <input value={form.complemento} onChange={(e) => patch("complemento", e.target.value)} style={input} />
          </Field>

          <div style={row2}>
            <Field label="Latitude">
              <input value={form.latitude} onChange={(e) => patch("latitude", e.target.value)} style={input} />
            </Field>
            <Field label="Longitude">
              <input value={form.longitude} onChange={(e) => patch("longitude", e.target.value)} style={input} />
            </Field>
          </div>

          <Field label="Obs.">
            <textarea
              value={form.observacoes}
              onChange={(e) => patch("observacoes", e.target.value)}
              rows={6}
              style={textarea}
            />
          </Field>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={handleSave}
              style={{
                height: 34,
                padding: "0 14px",
                borderRadius: 8,
                border: "1px solid #7c7c7c",
                background: "#e9e9e9",
                color: "#333",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontWeight: 700,
              }}
            >
              <Save size={14} />
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 14, color: "#1f1f1f" }}>{label}</span>
      {children}
    </label>
  );
}

const row2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "180px 1fr",
  gap: 12,
};

const row3: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 160px",
  gap: 12,
};

const rowAddress: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 90px",
  gap: 12,
};

const input: React.CSSProperties = {
  width: "100%",
  height: 34,
  borderRadius: 6,
  border: "1px solid #b4b4b4",
  background: "#dcdcdc",
  padding: "0 10px",
  outline: "none",
  color: "#333",
};

const textarea: React.CSSProperties = {
  width: "100%",
  borderRadius: 6,
  border: "1px solid #b4b4b4",
  background: "#dcdcdc",
  padding: "10px",
  outline: "none",
  color: "#333",
  resize: "vertical",
};