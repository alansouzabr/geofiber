"use client";

import { useEffect, useState } from "react";
import MrrChart from "@/components/admin/MrrChart";
import PayButton from "@/components/admin/PayButton";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(process.env.NEXT_PUBLIC_API_URL + "/admin/metrics", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setMetrics);

    fetch(process.env.NEXT_PUBLIC_API_URL + "/admin/metrics/mrr-history", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => Array.isArray(d) ? setHistory(d) : []);
  }, []);

  if (!metrics) return <div>Carregando...</div>;

  return (
    <div style={{ padding: 30, background: "#0b0f19", minHeight: "100vh", color: "#fff" }}>
      <h1>📊 SaaS Analytics</h1>

      <div style={{ display: "flex", gap: 20 }}>
        <div>MRR: {metrics.mrr}</div>
        <div>Empresas: {metrics.totalCompanies}</div>
        <div>Ativas: {metrics.activeCompanies}</div>
      </div>

      <div style={{ marginTop: 20 }}>
        <PayButton
          companyId={metrics.companyId}
          priceId="price_REAL_DO_STRIPE"
        />
      </div>

      <div style={{ marginTop: 30 }}>
        <MrrChart data={history} />
      </div>
    </div>
  );
}
