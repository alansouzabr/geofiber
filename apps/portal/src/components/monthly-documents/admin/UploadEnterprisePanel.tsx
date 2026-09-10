"use client";

import { useEffect, useState } from "react";

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro"
];

export default function UploadEnterprisePanel() {

  const [companies, setCompanies] =
    useState<any[]>([]);

  const [companyId, setCompanyId] =
    useState("");

  const [year, setYear] =
    useState(new Date().getFullYear());

  const [documents, setDocuments] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  async function loadCompanies() {

    const token =
      localStorage.getItem("token");

    const res = await fetch(
      "https://api.geofibers.com.br/admin/companies",
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    const data =
      await res.json();

    setCompanies(
      Array.isArray(data)
        ? data
        : []
    );
  }

  async function loadDocuments(
    selectedCompanyId: string
  ) {

    if (!selectedCompanyId) {
      return;
    }

    const token =
      localStorage.getItem("token");

    const res = await fetch(
      "https://api.geofibers.com.br/monthly-documents",
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    const data =
      await res.json();

    setDocuments(
      Array.isArray(data)
        ? data.filter(
            (d: any) =>
              d.companyId ===
              selectedCompanyId
          )
        : []
    );
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  async function deleteFile(
    month: number,
    field: string
  ) {

    try {

      const token =
        localStorage.getItem("token");

      await fetch(
        "https://api.geofibers.com.br/monthly-documents",
        {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer `
          },

          body: JSON.stringify({
            companyId,
            year,
            month,
            field
          })
        }
      );

      await loadDocuments(companyId);

      alert("Arquivo removido");

    } catch (err) {

      console.error(err);

      alert("Erro ao remover");
    }
  }

  async function uploadFile(
    file: File,
    month: number,
    field: string
  ) {

    if (!companyId) {
      alert("Selecione empresa");
      return;
    }

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const uploadRes =
        await fetch(
          "https://api.geofibers.com.br/upload",
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`
            },

            body: formData
          }
        );

      const uploadData =
        await uploadRes.json();

      await fetch(
        "https://api.geofibers.com.br/monthly-documents",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            companyId,
            year,
            month,
            field,
            url: uploadData.url
          })
        }
      );

      await loadDocuments(companyId);

      alert("Upload realizado");

    } catch (err) {

      console.error(err);

      alert("Erro upload");

    } finally {

      setLoading(false);
    }
  }

  return (

    <div style={container}>

      <h2>
        Upload Mensal Empresa
      </h2>

      <div style={topBar}>

        <select
          value={companyId}
          onChange={(e) => {

            const value =
              e.target.value;

            setCompanyId(value);

            loadDocuments(value);
          }}
          style={select}
        >

          <option value="">
            Selecione Empresa
          </option>

          {companies.map((c) => (

            <option
              key={c.id}
              value={c.id}
            >
              {c.name}
            </option>

          ))}

        </select>

        <input
          type="number"
          value={year}
          onChange={(e) =>
            setYear(
              Number(e.target.value)
            )
          }
          style={select}
        />

      </div>

      <div className="w-full overflow-x-auto overscroll-x-contain">
<table style={table}>

        <thead>

          <tr>

            <th>Mês</th>

            <th>ART / TRT</th>

            <th>Projeto DWG</th>

            <th>Outros</th>

          </tr>

        </thead>

        <tbody>

          {MONTHS.map((monthName, index) => {

            const doc =
              documents.find(
                (d: any) =>
                  d.month ===
                  index + 1
              );

            return (

              <tr key={monthName}>

                <td>
                  {monthName}
                </td>

                <td>

                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {

                      const file =
                        e.target.files?.[0];

                      if (file) {

                        uploadFile(
                          file,
                          index + 1,
                          "trtPdfUrl"
                        );
                      }
                    }}
                  />

                  {doc?.trtPdfUrl && (

                    <div>

                      <a
                        href={doc.trtPdfUrl}
                        target="_blank"
                        style={download}
                      >
                        Baixar TRT
                      </a>

                      <button
                        onClick={() =>
                          deleteFile(
                            index + 1,
                            "trtPdfUrl"
                          )
                        }
                        style={removeButton}
                      >
                        Excluir TRT
                      </button>

                    </div>

                  )}

                </td>

                <td>

                  <input
                    type="file"
                    accept=".dwg"
                    onChange={(e) => {

                      const file =
                        e.target.files?.[0];

                      if (file) {

                        uploadFile(
                          file,
                          index + 1,
                          "dwgUrl"
                        );
                      }
                    }}
                  />

                  {doc?.dwgUrl && (

                    <a
                      href={doc.dwgUrl}
                      target="_blank"
                      style={download}
                    >
                      Baixar DWG
                    </a>

                  )}

                </td>

                <td>

                  <input
                    type="file"
                    onChange={(e) => {

                      const file =
                        e.target.files?.[0];

                      if (file) {

                        uploadFile(
                          file,
                          index + 1,
                          "otherUrl"
                        );
                      }
                    }}
                  />

                  {doc?.otherUrl && (

                    <a
                      href={doc.otherUrl}
                      target="_blank"
                      style={download}
                    >
                      Baixar Arquivo
                    </a>

                  )}

                </td>

              </tr>

            );
          })}

        </tbody>

      </table>
</div>

      {loading && (

        <div style={{ marginTop: 20 }}>
          Uploading...
        </div>

      )}

    </div>
  );
}

const container = {
  background: "#111827",
  padding: 30,
  borderRadius: 14,
  color: "white",
  marginTop: 40
};

const topBar = {
  display: "flex",
  gap: 20,
  marginTop: 20,
  marginBottom: 30
};

const select = {
  background: "#1f2937",
  color: "white",
  border: "1px solid #374151",
  borderRadius: 10,
  padding: 12,
  minWidth: 220
};

const table = {
  width: "100%",
  borderCollapse: "collapse" as const
};

const download = {
  display: "inline-block",
  marginTop: 10,
  color: "#4ade80",
  fontWeight: 700
};

const removeButton = {
  display: "block",
  marginTop: 10,
  background: "#7f1d1d",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: 8,
  cursor: "pointer"
};
