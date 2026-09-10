"use client";
import { apiFetch } from "@/lib/api";

import React, { useMemo, useState } from "react";
import { useMap } from "react-leaflet";

function onlyDigits(s: string) {
  return (s || "").replace(/\D+/g, "");
}

export function MapSearchCEP() {
  const map = useMap();

  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [compl, setCompl] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const cepDigits = useMemo(() => onlyDigits(cep), [cep]);
  const numDigits = useMemo(() => onlyDigits(numero), [numero]);

  const validCep = cepDigits.length === 8;
  const validNum = numDigits.length >= 1; // precisa ter pelo menos 1 dígito

  async function handleSearch() {
    setMsg("");

    if (!validCep) {
      setMsg("CEP inválido (precisa ter 8 dígitos).");
      return;
    }
    if (!validNum) {
      setMsg("Informe o número da casa.");
      return;
    }

    const c = cepDigits;

    try {
      setLoading(true);

      // 1) ViaCEP -> endereço base
      const viacep = await apiFetch(`https://viacep.com.br/ws/${c}/json/`, { cache: "no-store" });
      const data = await viacep.json();

      if (data?.erro) {
        setMsg("CEP não encontrado.");
        return;
      }

      const logradouro = data?.logradouro || "";
      const bairro = data?.bairro || "";
      const localidade = data?.localidade || "";
      const uf = data?.uf || "";

      // Monta query mais precisa: rua + número + cidade/uf + Brasil
      // Obs: nem todo CEP tem logradouro (CEP geral). Ainda assim tentamos.
      const queryParts = [
        logradouro ? `${logradouro}, ${numDigits}` : "",
        compl ? compl : "",
        bairro ? bairro : "",
        localidade && uf ? `${localidade} - ${uf}` : localidade || uf,
        "Brasil",
      ].filter(Boolean);

      const query = queryParts.join(", ");
      if (!query) {
        setMsg("Endereço incompleto para localizar.");
        return;
      }

      // 2) Geocoding (Nominatim OSM) -> lat/lng
      const url =
        "https://nominatim.openstreetmap.org/search?" +
        new URLSearchParams({
          format: "json",
          limit: "1",
          countrycodes: "br",
          addressdetails: "1",
          q: query,
        }).toString();

      const r = await apiFetch(url, {
        headers: { "Accept-Language": "pt-BR" },
        cache: "no-store",
      });

      const results = await r.json();
      const first = Array.isArray(results) ? results[0] : null;

      if (!first?.lat || !first?.lon) {
        setMsg("Não consegui localizar esse CEP + número (geocoder).");
        return;
      }

      const lat = Number(first.lat);
      const lng = Number(first.lon);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        setMsg("Coordenadas inválidas retornadas pelo geocoder.");
        return;
      }

      map.setView([lat, lng], 19, { animate: true });

      const label = `${logradouro ? logradouro + ", " : ""}${numDigits} — ${localidade}/${uf}`;
      setMsg(label);
    } catch (e: any) {
      setMsg(`Erro ao buscar: ${e?.message || "desconhecido"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 1100,
        top: 14,
        left: 14,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: 10,
        borderRadius: 14,
        background: "rgba(10, 12, 18, 0.70)",
        border: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(8px)",
        color: "white",
        flexWrap: "wrap",
        maxWidth: 760,
      }}
    >
      <input
        value={cep}
        onChange={(e) => setCep(e.target.value)}
        placeholder="CEP (ex: 01001000)"
        inputMode="numeric"
        style={{
          width: 170,
          padding: "10px 12px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(255,255,255,0.06)",
          color: "white",
          outline: "none",
        }}
      />

      <input
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
        placeholder="Número (ex: 123)"
        inputMode="numeric"
        style={{
          width: 140,
          padding: "10px 12px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(255,255,255,0.06)",
          color: "white",
          outline: "none",
        }}
      />

      <input
        value={compl}
        onChange={(e) => setCompl(e.target.value)}
        placeholder="Complemento (opcional)"
        style={{
          width: 220,
          padding: "10px 12px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(255,255,255,0.06)",
          color: "white",
          outline: "none",
        }}
      />

      <button
        type="button"
        onClick={handleSearch}
        disabled={!validCep || !validNum || loading}
        style={{
          cursor: validCep && validNum && !loading ? "pointer" : "not-allowed",
          padding: "10px 12px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.14)",
          background: validCep && validNum && !loading ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
          color: "white",
          whiteSpace: "nowrap",
        }}
        title="Centralizar no CEP + Número"
      >
        {loading ? "Buscando..." : "Ir"}
      </button>

      {msg ? (
        <span
          style={{
            fontSize: 12,
            opacity: 0.9,
            maxWidth: 520,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {msg}
        </span>
      ) : null}
    </div>
  );
}