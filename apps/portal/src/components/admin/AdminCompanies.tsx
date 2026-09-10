"use client";

import { useEffect, useState } from "react";

export default function AdminCompanies() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  async function load() {
    try {
      const res = await fetch("https://api.geofibers.com.br/admin/companies", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setCompanies(Array.isArray(data) ? data : []);    } catch (err) {
      console.error("Erro:", err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleCompany(id: string) {
    await fetch(`https://api.geofibers.com.br/admin/company/${id}/toggle`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    load();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Painel Admin</h1>

      <div className="w-full overflow-x-auto overscroll-x-contain">
<table style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th>Empresa</th>
            <th>Status</th>
            
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {companies.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.isActive ? "Ativo" : "Bloqueado"}</td>
              
              <td>
                <button onClick={() => toggleCompany(c.id)}>
                  Toggle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
</div>
    </div>
  );
}
