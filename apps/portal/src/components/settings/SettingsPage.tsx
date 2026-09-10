"use client";

import {useState} from "react";

import SettingsMenu from "./SettingsMenu";

import UsersManager from "@/components/client/users/UsersManager";

export default function SettingsPage(){

  const [tab,setTab]=useState("usuarios");

  return(

    <div>

      <SettingsMenu
        active={tab}
        onChange={setTab}
      />

      {tab==="usuarios" && <UsersManager/>}

      {tab==="tecnicos" && (
        <div className="p-6 rounded-xl bg-slate-900 text-slate-300">
          Módulo Técnicos será integrado ao FieldTechnicianProfile.
        </div>
      )}

      {tab==="equipes" && (
        <div className="p-6 rounded-xl bg-slate-900 text-slate-300">
          Módulo Equipes.
        </div>
      )}

      {tab==="permissoes" && (
        <div className="p-6 rounded-xl bg-slate-900 text-slate-300">
          Módulo Permissões.
        </div>
      )}

      {tab==="integracoes" && (
        <div className="p-6 rounded-xl bg-slate-900 text-slate-300">
          Módulo Integrações.
        </div>
      )}

    </div>

  );

}
