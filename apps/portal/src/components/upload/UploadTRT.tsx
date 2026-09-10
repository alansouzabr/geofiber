"use client";

import { useState } from "react";

export default function UploadTRT({ onUploaded }: any) {

  const [file, setFile] = useState<File | null>(null);

  const [title, setTitle] = useState("");

  const [observation, setObservation] = useState("");

  const [engineerName, setEngineerName] = useState("");

  const [technician, setTechnician] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleUpload() {

    if (!file) {
      alert("Selecione um PDF");
      return;
    }

    if (!title) {
      alert("Informe o título TRT");
      return;
    }

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("file", file);

      const uploadRes = await fetch(
        "https://api.geofibers.com.br/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();

      if (!uploadData.url) {
        alert("Erro upload PDF");
        return;
      }

      const trtRes = await fetch(
        "https://api.geofibers.com.br/trt",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title,
            observation,
            engineerName,
            technician,
            pdfUrl: uploadData.url,
          }),
        }
      );

      const trtData = await trtRes.json();

      console.log("TRT:", trtData);

      if (!trtRes.ok) {
        alert(trtData.message || "Erro TRT");
        return;
      }

      alert("TRT enviada com sucesso");

      onUploaded?.(uploadData.url);

      window.location.reload();

    } catch (err) {

      console.error(err);

      alert("Erro upload TRT");

    } finally {

      setLoading(false);
    }
  }

  return (
    <div style={{
      border: "1px solid rgba(255,255,255,.1)",
      background: "#0f172a",
      padding: 24,
      borderRadius: 16,
      color: "#fff",
      marginBottom: 30
    }}>

      <h2 style={{ marginBottom: 20 }}>
        Upload TRT Enterprise
      </h2>

      <input
        placeholder="Título TRT"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={inputStyle}
      />

      <textarea
        placeholder="Observações"
        value={observation}
        onChange={(e) => setObservation(e.target.value)}
        style={{
          ...inputStyle,
          minHeight: 100,
          resize: "vertical"
        }}
      />

      <input
        placeholder="Engenheiro responsável"
        value={engineerName}
        onChange={(e) => setEngineerName(e.target.value)}
        style={inputStyle}
      />

      <input
        placeholder="Técnico responsável"
        value={technician}
        onChange={(e) => setTechnician(e.target.value)}
        style={inputStyle}
      />

      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
        style={{
          marginBottom: 20
        }}
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          background: "#22d3ee",
          border: "none",
          color: "#020617",
          padding: "14px 20px",
          borderRadius: 12,
          fontWeight: 700,
          cursor: "pointer",
          width: "100%"
        }}
      >
        {loading ? "Enviando..." : "Enviar TRT"}
      </button>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginBottom: 16,
  padding: 14,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,.1)",
  background: "#111827",
  color: "#fff"
};
