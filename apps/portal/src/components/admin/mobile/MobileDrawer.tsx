"use client";

import Link from "next/link";

import { useContext } from "react";

import {
  AuthContext,
} from "@/context/AuthContext";

import {
  buildCompanyDashboardHref,
} from "@/components/client/navigation/companyRouteMap";

import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  FolderKanban,
  ChartColumn,
  CreditCard,
  Shield,
  Settings,
    GraduationCap,
  X
} from "lucide-react";

interface Props {

  open: boolean;

  onClose: any;
}


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


export default function MobileDrawer({

  open,

  onClose

}: Props) {


  /*
   * ETAPA33A24_ADMIN_MOBILE_PERMISSION_AWARE
   *
   * Mesmo teto de módulos utilizado
   * pelo AdminSidebar desktop.
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
            flex
            flex-col
            overflow-y-auto
            overscroll-contain
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
              GeoFiber
            </h1>

            <p
              className="
                text-slate-500
                text-sm
                mt-1
              "
            >
              Enterprise SaaS
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

        <nav
          className="
            flex
            flex-col
            gap-2
            p-4
          "
        >

          {visibleItems.map((item) => {

            const Icon = item.icon;

            return (

              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  hover:bg-slate-800
                  transition-all
                  text-slate-300
                  hover:text-white
                "
              >

                <Icon size={18} />

                <span>
                  {item.label}
                </span>

              </Link>
            );
          })}

        </nav>

          {/* ETAPA30A1_CONFIGURACOES */}
          {showSettings && (
          <div
            className="
              mx-4
              border-t
              border-slate-800
              pt-3
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                px-4
                py-2
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
                onClick={onClose}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  text-slate-400
                  transition-all
                  hover:bg-slate-800
                  hover:text-white
                "
              >

                <CreditCard size={17} />

                <span>
                  Financeiro
                </span>

              </Link>

            </div>

          </div>


          )}
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
              {String((auth?.user as any)?.name || (auth?.user as any)?.fullName || (auth?.user as any)?.displayName || (auth?.user as any)?.email || "ADMIN")}
            </p>

            <p
              className="
                text-xs
                text-slate-400
                mt-1
              "
            >
              {String((auth?.user as any)?.email || "Administrador")}
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
