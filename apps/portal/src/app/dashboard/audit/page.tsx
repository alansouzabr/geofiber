"use client";

import { useEffect, useState } from "react";

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("SEM TOKEN");
      return;
    }

    fetch("https://api.geofibers.com.br/audit", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLogs(data);
        } else {
          console.error("Erro API:", data);
          setLogs([]);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Audit Timeline</h1>

      {logs.length === 0 && <p>Nenhum log encontrado</p>}

      {logs.map((log) => (
        <div key={log.id} style={{
          borderLeft: "4px solid #0070f3",
          padding: 10,
          marginBottom: 15,
          background: "#111",
          color: "#fff"
        }}>
          <strong>{log.action}</strong> — {log.model}

          {log.data?.changes &&
            Object.entries(log.data.changes).map(([field, change]: any) => (
              <div key={field}>
                <b>{field}</b>
                <div style={{ color: "red" }}>- {change.before}</div>
                <div style={{ color: "green" }}>+ {change.after}</div>
              </div>
            ))
          }
        </div>
      ))}
    </div>
  );
}
