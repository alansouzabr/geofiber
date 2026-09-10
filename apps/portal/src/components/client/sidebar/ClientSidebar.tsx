"use client";
/* ETAPA35A13E_R1_SIDEBAR */

import ClientNavigation from "../navigation/ClientNavigation";
import SidebarFooter from "@/components/layout/sidebar/SidebarFooter";


interface Props {

  company?: any;

  tab: string;

  setTab: (
    tab: string
  ) => void;
}

export default function ClientSidebar({
  company,
  tab,
  setTab
}: Props) {

  return (

    <aside
      className="hidden lg:flex w-[280px] bg-slate-950 border-r border-slate-800 p-6 flex-col h-dvh overflow-y-auto overscroll-contain sticky top-0"
    >

      <div className="mb-10">

        <h1
          className="
            text-3xl
            font-black
            text-cyan-400
          "
        >
          GeoFiber
        </h1>

        <p
          className="
            text-slate-500
            mt-2
          "
        >
          {company?.name || "Empresa"}
        </p>

      </div>

      
<ClientNavigation
  tab={tab}
  setTab={setTab}
/>


    
  <SidebarFooter
    name={company?.name || "Empresa"}
    role="Cliente"
    email=""
  />

    </aside>
  );
}
