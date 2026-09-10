"use client";
/* ETAPA35A13E_R1_FOOTER */

import { LogOut, UserCircle2 } from "lucide-react";

interface Props {
  collapsed?: boolean;
  name?: string;
  role?: string;
  email?: string;
}

export default function SidebarFooter({
  collapsed = false,
  name = "MASTER ADMIN",
  role = "Administrador",
  email = "engenheirodatelecom@gmail.com"
}: Props) {

  function logout() {

    localStorage.removeItem("token");

    document.cookie =
      "gf_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    window.location.href = "/login";
  }

  return (

    <div
      className="border-t border-slate-800 p-4 space-y-4 mt-auto shrink-0 pt-4"
    >

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-xl
          p-4
        "
      >

        <div className="flex items-center gap-3">

          <UserCircle2
            size={38}
            className="text-cyan-400 shrink-0"
          />

          {!collapsed && (

            <div className="overflow-hidden">

              <div className="font-semibold truncate">
                {name}
              </div>

              <div className="text-xs text-slate-400 truncate">
                {role}
              </div>

              <div className="text-xs text-slate-500 truncate">
                {email}
              </div>

            </div>

          )}

        </div>

      </div>

      <button
        onClick={logout}
        className="
          w-full
          flex
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-red-600
          hover:bg-red-700
          transition
          py-3
          font-semibold
          text-white
        "
      >

        <LogOut size={18} />

        {!collapsed && (
          <span>Sair</span>
        )}

      </button>

    </div>

  );

}
