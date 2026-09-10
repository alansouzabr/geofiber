"use client";

import { useEffect, useState } from "react";

export default function TRTList() {

  const [trts, setTrts] = useState<any[]>([]);

  async function loadTRTs() {

    const token = localStorage.getItem("token");

    if (!token) return;

    const res = await fetch(
      "https://api.geofibers.com.br/trt",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (Array.isArray(data)) {
      setTrts(data);
    }
  }

  useEffect(() => {
    loadTRTs();
  }, []);

  async function deleteTRT(id: string) {

    const confirmDelete = confirm(
      "Excluir TRT?"
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `https://api.geofibers.com.br/trt/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      loadTRTs();
    } else {
      alert("Erro excluir TRT");
    }
  }

  return (
    <div style={{ marginTop: 30 }}>

      <h2 style={{
        marginBottom: 20
      }}>
        Histórico TRT
      </h2>

      {trts.length === 0 && (
        <p>Nenhuma TRT encontrada</p>
      )}

      {trts.map((trt) => (

        <div
          key={trt.id}
          style={{
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 16,
            padding: 20,
            marginBottom: 18,
            color: "#fff"
          }}
        >

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
            gap: 12,
            flexWrap: "wrap"
          }}>

            <div>
              <div style={{
                fontSize: 18,
                fontWeight: 700
              }}>
                {trt.title}
              </div>

              <div style={{
                opacity: .7,
                marginTop: 4
              }}>
                {trt.protocol}
              </div>
            </div>

            <div style={{
              padding: "8px 14px",
              borderRadius: 999,
              background:
                trt.status === "APPROVED"
                  ? "#14532d"
                  : "#78350f",
              color: "#fff",
              fontWeight: 700,
              height: "fit-content"
            }}>
              {trt.status}
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <b>Observação:</b>
            <br />
            {trt.observation || "Sem observação"}
          </div>

          <div style={{ marginBottom: 10 }}>
            <b>Engenheiro:</b> {trt.engineerName || "-"}
          </div>

          <div style={{ marginBottom: 18 }}>
            <b>Técnico:</b> {trt.technician || "-"}
          </div>

          <div style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap"
          }}>

            <a
              href={trt.pdfUrl}
              target="_blank"
              style={btnStyle}
            >
              📄 Abrir PDF
            </a>

            <button
              onClick={() => deleteTRT(trt.id)}
              style={{
                ...btnStyle,
                background: "#7f1d1d"
              }}
            >
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const btnStyle: any = {
  background: "#1e293b",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: 10,
  cursor: "pointer",
  textDecoration: "none",
  fontWeight: 600
};
