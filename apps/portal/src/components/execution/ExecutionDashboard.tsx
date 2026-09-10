"use client";

import { useState } from "react";

import ExecutionMenu from "./dashboard/ExecutionMenu";
import ExecutionToolbar from "./dashboard/ExecutionToolbar";
import ExecutionStats from "./dashboard/ExecutionStats";
import TechniciansPage from "./technicians/TechniciansPage";

export default function ExecutionDashboard() {

  const [tab,setTab]=useState("dashboard");

  return (

    <div className="space-y-6">

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

        <h1 className="text-3xl font-bold text-white">
          Central de Execução
        </h1>

        <p className="mt-2 text-slate-400">
          Gestão operacional da empresa.
        </p>

      </div>

      <ExecutionMenu
        tab={tab}
        setTab={setTab}
      />

      <ExecutionToolbar />

      <div className="rounded border border-yellow-500 bg-yellow-950 px-3 py-2 text-sm text-yellow-300">
        TAB ATUAL: {tab}
      </div>

      {tab==="dashboard" && <ExecutionStats />}

      {tab==="orders" && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-white">
          Ordens de Serviço
        </div>
      )}

      {tab==="technicians" && <TechniciansPage />}

      {tab==="teams" && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-white">
          Equipes
        </div>
      )}

      {tab==="calendar" && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-white">
          Agenda
        </div>
      )}

      {tab==="reports" && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-white">
          Relatórios
        </div>
      )}

    </div>

  );

}
