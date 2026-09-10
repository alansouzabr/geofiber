"use client";

import Link from "next/link";

const menus = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Telecomunicação", href: "/arquivos" },
  { label: "Projetos", href: "/projetos" },
  { label: "TRTs", href: "/dashboard/trt" },
  { label: "Usuários", href: "/usuarios" },
  { label: "Financeiro", href: "/financeiro" },
  { label: "Configurações", href: "#" }
];

export default function Sidebar() {

  return (

    <aside
      className="
        w-[280px]
        bg-[#08111f]
        border-r
        border-slate-800
        flex
        flex-col
      "
    >

      <div className="p-8">

        <h1
          className="
            text-5xl
            font-bold
            text-cyan-400
          "
        >
          GeoFiber
        </h1>

        <p className="mt-2 text-slate-400">
          Portal Enterprise
        </p>

      </div>

      <nav className="flex-1 px-4 space-y-2">

        {menus.map(menu => (

          <Link
            key={menu.label}
            href={menu.href}
            className="
              block
              rounded-xl
              px-5
              py-4
              text-slate-300
              transition
              hover:bg-cyan-500
              hover:text-slate-950
            "
          >
            {menu.label}
          </Link>

        ))}

      </nav>

      <div
        className="
          m-5
          rounded-2xl
          border
          border-slate-700
          p-5
        "
      >

        <div className="text-sm text-slate-400">
          Empresa Atual
        </div>

        <div className="mt-2 font-bold">
          Provedor Gamma
        </div>

        <div className="mt-1 text-xs text-slate-500">
          Cliente Enterprise
        </div>

      </div>

    </aside>

  );

}
