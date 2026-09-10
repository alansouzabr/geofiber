"use client";

import EnterpriseNavigation from "../navigation/EnterpriseNavigation";

import {
  X
} from "lucide-react";

interface Props {

  company?: any;

  tab: string;

  setTab: (tab:string)=>void;

  open: boolean;

  onClose: any;
}

export default function EnterpriseMobileDrawer({

  company,

  tab,

  setTab,

  open,

  onClose

}: Props) {

  return (

    <>

      {open && (

        <div
          onClick={onClose}
          className="
            fixed
            inset-0
            bg-black/70
            z-40
            lg:hidden
          "
        />

      )}

      <aside
        className={`
          fixed
          top-0
          left-0
          h-full
          w-[280px]
          bg-slate-950
          border-r
          border-slate-800
          z-50
          transform
          transition-transform
          duration-300
          lg:hidden
          ${open
            ? "translate-x-0"
            : "-translate-x-full"}
        `}
      >

        <div
          className="
            flex
            items-center
            justify-between
            p-6
            border-b
            border-slate-800
          "
        >

          <div>

            <h1
              className="
                text-2xl
                font-black
                text-cyan-400
              "
            >
              {company?.name || "Empresa"}
            </h1>

            <p
              className="
                text-slate-500
                text-sm
                mt-1
              "
            >
              {company?.plan || "Portal Enterprise"}
            </p>

          </div>

          <button
            onClick={onClose}
            className="
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              p-2
              text-white
            "
          >
            <X size={18} />
          </button>

        </div>

        
<EnterpriseNavigation
  tab={tab}
  setTab={setTab}
  onNavigate={onClose}
/>


        <div
          className="
            mt-auto
            border-t
            border-slate-800
            p-4
            space-y-4
          "
        >

          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-4
            "
          >

            <p
              className="
                text-sm
                font-semibold
                text-white
              "
            >
              {company?.name || "Empresa"}
            </p>

            <p
              className="
                text-xs
                text-slate-400
                mt-1
              "
            >
              {company?.email || "Usuário Enterprise"}
            </p>

          </div>

          <button
            onClick={() => {

              localStorage.removeItem("token");

              document.cookie =
                "gf_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

              window.location.href =
                "/login";
            }}
            className="
              w-full
              bg-red-500
              hover:bg-red-600
              transition
              text-white
              font-semibold
              py-3
              rounded-xl
            "
          >
            Sair
          </button>

        </div>

      </aside>

    </>
  );
}
