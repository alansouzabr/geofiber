"use client";

import StatsCard from "./StatsCard";

export default function DashboardStats({
  company,
}: any) {
  return (
    <section
      className="
        mt-8
        grid
        gap-6
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >
      <StatsCard
        title="Empresa"
        value={company?.name || "-"}
        color="#22d3ee"
      />

      <StatsCard
        title="Plano"
        value={company?.plan?.name || "Enterprise"}
        color="#4ade80"
      />

      <StatsCard
        title="Usuários"
        value="1 / 50"
        color="#a78bfa"
      />

      <StatsCard
        title="Status"
        value={
          company?.isActive
            ? "ATIVA"
            : "PENDENTE"
        }
        color={
          company?.isActive
            ? "#22c55e"
            : "#f59e0b"
        }
      />
    </section>
  );
}
