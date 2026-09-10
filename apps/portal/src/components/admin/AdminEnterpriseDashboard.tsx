"use client";

import { useEffect, useState } from "react";

import StatsCard
  from "./cards/StatsCard";

import CompaniesTable
  from "./tables/CompaniesTable";

import {
  getAdminStats,
  getCompanies,
  activateCompany,
  deactivateCompany,
  deleteCompany
} from "./services/admin.service";

import {
  Company,
  DashboardStats
} from "./types/admin.types";

export default function AdminEnterpriseDashboard() {

  const [
    stats,
    setStats
  ] = useState<DashboardStats | null>(
    null
  );

  const [
    companies,
    setCompanies
  ] = useState<Company[]>([]);

  const [
    showPendingOnly,
    setShowPendingOnly
  ] = useState(false);

  async function load() {

    try {

      const statsData =
        await getAdminStats();

      const companiesData =
        await getCompanies();

      setStats(statsData);
      setCompanies(companiesData);

    } catch (err) {

      console.error(err);

    }

  }

  useEffect(() => {

    load();

  }, []);

  async function onActivate(
    id: string
  ) {

    try {

      await activateCompany(id);

      await load();

    } catch (err: any) {

      console.error(
        "ACTIVATE COMPANY ERROR",
        err
      );

      alert(
        err?.message ||
        String(err)
      );

    }

  }

  async function onDeactivate(
    id: string
  ) {

    try {

      await deactivateCompany(id);

      await load();

    } catch (err: any) {

      console.error(
        "DEACTIVATE COMPANY ERROR",
        err
      );

      alert(
        err?.message ||
        String(err)
      );

    }

  }

  async function onDelete(
    company: Company
  ) {

    const confirmed =
      confirm(
        `Excluir ${company.name}?`
      );

    if (!confirmed) {
      return;
    }

    try {

      console.log(
        "DELETE COMPANY",
        company.id,
        company.name
      );

      await deleteCompany(
        company.id
      );

      alert(
        "Empresa excluída"
      );

      await load();

    } catch (err: any) {

      console.error(
        "DELETE ERROR",
        err
      );

      alert(
        err?.message ||
        String(err)
      );

    }

  }

  const pendingCompanies =
    companies.filter(
      company =>
        company.isActive !== true
    );

  const visibleCompanies =
    showPendingOnly
      ? pendingCompanies
      : companies;

  return (

    <div className="space-y-8">

      {/* ==================================================
          CABEÇALHO DO DASHBOARD MASTER
          ================================================== */}

      <div>
        <h1
          className="
            text-2xl
            sm:text-3xl
            font-black
            tracking-tight
            text-white
          "
        >
          Dashboard
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-slate-400
          "
        >
          Visão geral da plataforma GeoFiber Enterprise.
        </p>
      </div>

      {/* ==================================================
          INDICADORES DO MASTER
          ================================================== */}

      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-3
          xl:grid-cols-5
          gap-6
        "
      >

        <StatsCard
          title="Empresas"
          value={
            stats?.companies || 0
          }
        />

        <StatsCard
          title="Usuários"
          value={
            stats?.users || 0
          }
        />

        <StatsCard
          title="TRTs"
          value={
            stats?.trts || 0
          }
        />

        <StatsCard
          title="TRTs Pendentes"
          value={
            stats?.pendingTrts || 0
          }
        />

        {/* ==================================================
            LIBERAÇÃO DE EMPRESAS
            ================================================== */}

        <div
          className="
            rounded-2xl
            border
            border-cyan-500/30
            bg-slate-900
            p-5
            min-h-[120px]
            flex
            flex-col
            justify-between
          "
        >

          <div>

            <p
              className="
                text-sm
                text-cyan-400
                font-semibold
              "
            >
              Liberação
            </p>

            <p
              className="
                text-3xl
                font-black
                text-white
                mt-2
              "
            >
              {pendingCompanies.length}
            </p>

            <p
              className="
                text-xs
                text-slate-400
                mt-1
              "
            >
              empresa(s) aguardando aprovação
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setShowPendingOnly(
                current => !current
              )
            }
            className="
              mt-4
              w-full
              rounded-lg
              bg-cyan-600
              hover:bg-cyan-500
              px-3
              py-2
              text-sm
              font-bold
              text-white
              transition
            "
          >
            {showPendingOnly
              ? "Ver todas"
              : "Ver pendentes"}
          </button>

        </div>

      </div>


      {/* ==================================================
          ÁREA DE LIBERAÇÃO / EMPRESAS
          ================================================== */}

      <div
        className="
          w-full
          rounded-2xl
          border
          border-slate-800
          bg-slate-950/40
          p-4
          sm:p-5
        "
      >

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-3
            mb-4
          "
        >

          <div>

            <h2
              className="
                text-lg
                font-bold
                text-white
              "
            >
              {showPendingOnly
                ? "Empresas aguardando liberação"
                : "Empresas para gerenciamento"}
            </h2>

            <p
              className="
                text-sm
                text-slate-400
                mt-1
              "
            >
              {showPendingOnly
                ? `${pendingCompanies.length} empresa(s) aguardando aprovação.`
                : `${companies.length} empresa(s) cadastrada(s) na plataforma.`}
            </p>

          </div>

          {showPendingOnly && (

            <button
              type="button"
              onClick={() =>
                setShowPendingOnly(false)
              }
              className="
                rounded-lg
                border
                border-slate-700
                bg-slate-900
                hover:bg-slate-800
                px-4
                py-2
                text-sm
                font-semibold
                text-slate-200
                transition
              "
            >
              Mostrar todas
            </button>

          )}

        </div>

        <CompaniesTable
          companies={visibleCompanies}
          onActivate={onActivate}
          onDeactivate={onDeactivate}
          onDelete={onDelete}
        />

      </div>

    </div>

  );

}
