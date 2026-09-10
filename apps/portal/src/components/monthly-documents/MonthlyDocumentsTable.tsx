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

export default function MonthlyDocumentsTable() {

  const [docs, setDocs] =
    useState<any[]>([]);

  async function load() {

    const token =
      localStorage.getItem("token");

    const res =
      await fetch(
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

    setDocs(
      Array.isArray(data)
        ? data
        : []
    );
  }

  useEffect(() => {
    load();
  }, []);

  function findMonth(month: number) {

    return docs.find(
      (d) => d.month === month
    );
  }

  return (
    <div
      style={{
        background: "#111827",
        borderRadius: 12,
        padding: 20,
        overflowX: "auto"
      }}
    >

      <div className="w-full overflow-x-auto overscroll-x-contain">
<table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          color: "white"
        }}
      >

        <thead>
          <tr>
            <th style={th}>Mês</th>
            <th style={th}>ART / TRT</th>
            <th style={th}>Projeto DWG</th>
            <th style={th}>Outros</th>
          </tr>
        </thead>

        <tbody>

          {MONTHS.map((month, index) => {

            const item =
              findMonth(index + 1);

            return (
              <tr key={month}>

                <td style={td}>
                  {month}
                </td>

                <td style={td}>
                  {item?.trtPdfUrl ? (
                    <a
                      href={item.trtPdfUrl}
                      target="_blank"
                      style={link}
                    >
                      Baixar
                    </a>
                  ) : (
                    "-"
                  )}
                </td>

                <td style={td}>
                  {item?.dwgUrl ? (
                    <a
                      href={item.dwgUrl}
                      target="_blank"
                      style={link}
                    >
                      Baixar
                    </a>
                  ) : (
                    "-"
                  )}
                </td>

                <td style={td}>
                  {item?.otherUrl ? (
                    <a
                      href={item.otherUrl}
                      target="_blank"
                      style={link}
                    >
                      Baixar
                    </a>
                  ) : (
                    "-"
                  )}
                </td>

              </tr>
            );
          })}

        </tbody>

      </table>
</div>

    </div>
  );
}

const th = {
  textAlign: "left" as const,
  padding: 14,
  borderBottom: "1px solid #374151"
};

const td = {
  padding: 14,
  borderBottom: "1px solid #1f2937"
};

const link = {
  color: "#60a5fa",
  textDecoration: "none"
};
