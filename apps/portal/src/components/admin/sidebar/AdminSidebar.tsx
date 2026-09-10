"use client";
/* ETAPA35A13E_R1_SIDEBAR */

import Link from "next/link";
import { useContext, useState } from "react";

import SidebarFooter from "@/components/layout/sidebar/SidebarFooter";
import SidebarMenu from "@/components/layout/sidebar/SidebarMenu";

import {
  AuthContext,
} from "@/context/AuthContext";

import {
  buildCompanyDashboardHref,
} from "@/components/client/navigation/companyRouteMap";

import {
  LayoutDashboard,
  Building2,
  Settings,
  FolderKanban,
  FileText,
  ChartColumn,
  CreditCard,
  PanelLeft,
  GraduationCap
} from "lucide-react";

const items = [
  {
    label: "Dashboard",
    href: "/dashboard/plataformas",
    companyTab: "dashboard",
    icon: LayoutDashboard,
    perm: "module.dashboard"
  },
  {
    label: "Treinamentos",
    href: "/treinamentos",
    companyTab: "treinamentos",
    icon: GraduationCap,
    perm: "module.training"
  },
  {
    label: "Telecomunicação",
    href: "/telecom/plataformas",
    companyTab: "telecom",
    icon: FileText,
    perm: "module.files"
  },
  {
    label: "Projetos",
    href: "/projetos/plataformas",
    companyTab: "projetos",
    icon: FolderKanban,
    perm: "module.projects"
  },
  {
    label: "Execução",
    href: "/execucao/plataformas",
    companyTab: "execucao",
    icon: ChartColumn,
    perm: "module.execution"
  },
  {
    label: "Empresa",
    href: "/usuarios",
    companyTab: "empresa",
    icon: Building2,
    perm: "module.company"
  }
];

export default function AdminSidebar() {


  /*
   * ETAPA33A2_ADMIN_PERMISSION_AWARE
   *
   * Visibilidade do menu ADMIN baseada
   * exclusivamente em user.permissions.
   */

  const auth =
    useContext(
      AuthContext
    );


  const permissions =
    auth?.user?.permissions ??
    [];


  /*
   * ETAPA35A11C2D_R1B_ADMIN_COMPANY_LINKS
   *
   * O ADMIN com companyId sempre retorna
   * ao ClientLayout da empresa.
   */
  const companyId =
    String(
      (auth?.user as any)
        ?.companyId ||
      ""
    ).trim();

  /*
   * ETAPA35A11C2D_R1B_R4_VISIBLE_ITEMS_CANONICAL
   *
   * RBAC primeiro.
   * Canonicalização company depois.
   */
  const visibleItems =
    items
      .filter(
        item => {

          if (
            !permissions.includes(
              item.perm
            )
          ) {
            return false;
          }

          /*
           * Telecomunicação exige:
           *
           * module.files
           * +
           * files.view
           */
          if (
            item.perm ===
            "module.files"
          ) {
            return permissions.includes(
              "files.view"
            );
          }

          return true;
        }
      )
      .map(
        item => ({
          ...item,

          href:
            companyId
              ? buildCompanyDashboardHref(
                  companyId,
                  item.companyTab
                )
              : item.href
        })
      );


  const financeHref =
    companyId
      ? buildCompanyDashboardHref(
          companyId,
          "financeiro"
        )
      : "/financeiro";


  const showSettings =
    permissions.includes(
      "module.settings"
    );

  const [collapsed,setCollapsed]=useState(false);

  return (

    <aside
      className={`hidden lg:flex bg-slate-950 border-r border-slate-800 transition-all duration-300 flex-col ${collapsed ? "w-[76px]" : "w-[280px]"} h-dvh overflow-y-auto overscroll-contain sticky top-0`}
    >

      <div className="p-5 border-b border-slate-800">

        <button
          title={collapsed ? "Abrir barra lateral" : "Fechar barra lateral"}
          onClick={()=>setCollapsed(!collapsed)}
          className="
            flex
            items-center
            justify-center
            w-10
            h-10
            rounded-lg
            text-slate-300
            hover:text-white
            hover:bg-slate-800
            transition-colors
          "
        >

          <PanelLeft size={18}/>

        </button>

      </div>

      <div className="px-6 py-6">

        {!collapsed && (

          <>
            <h1 className="text-3xl font-black text-cyan-400">
              GeoFiber
            </h1>

            <p className="text-slate-500 mt-2">
              Enterprise SaaS
            </p>
          </>

        )}

      </div>

      
      <SidebarMenu
        items={visibleItems}
        collapsed={collapsed}
      />

        {/* ETAPA30A1_CONFIGURACOES */}
        {showSettings && (
        <div
          className={`
            px-3
            pb-5
            ${collapsed ? "mt-2" : "mt-1"}
          `}
        >

          {collapsed ? (

            <Link
              href={financeHref}
              title="Configurações > Financeiro"
              className="
                flex
                h-11
                items-center
                justify-center
                rounded-xl
                text-slate-300
                transition-colors
                hover:bg-slate-800
                hover:text-white
              "
            >
              <Settings size={18} />
            </Link>

          ) : (

            <div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  text-slate-300
                "
              >
                <Settings size={18} />

                <span>
                  Configurações
                </span>
              </div>

              <div
                className="
                  ml-5
                  border-l
                  border-slate-700
                  pl-3
                "
              >

                <Link
                  href={financeHref}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    text-slate-400
                    transition-colors
                    hover:bg-slate-800
                    hover:text-white
                  "
                >
                  <CreditCard size={16} />

                  <span>
                    Financeiro
                  </span>
                </Link>

              </div>

            </div>

          )}

        </div>




        )}
      <SidebarFooter
        collapsed={collapsed}
        name={String((auth?.user as any)?.name || (auth?.user as any)?.fullName || (auth?.user as any)?.displayName || (auth?.user as any)?.email || "ADMIN")}
        role="Administrador"
        email={String((auth?.user as any)?.email || "Administrador")}
      />

    </aside>

  );

}
