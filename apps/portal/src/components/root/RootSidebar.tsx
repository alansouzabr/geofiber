"use client";
/* ETAPA35A14B_R3_ROOT_PATH_ACTIVE */
/* ETAPA35A13E_R1_SIDEBAR */

import {
  Building2,
  Users,
  Package,
  CreditCard,
  ShieldCheck,
  FileText,
  Settings,
  Activity,
  Plug,
  LayoutDashboard,
  KeyRound,
} from "lucide-react";

import SidebarFooter from "@/components/layout/sidebar/SidebarFooter";
import SidebarMenu from "@/components/layout/sidebar/SidebarMenu";

const items = [
  {
    label: "Dashboard",
    href: "/root",
    icon: LayoutDashboard,
  },
  {
    label: "Empresas",
    href: "/root/companies",
    icon: Building2,
  },

    {
      label: "Alvará / AVCB",
      href: "/empresa/alvara-avcb",
      icon: FileText,
    },
  {
    label: "Usuários Globais",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    label: "Produtos",
    href: "#",
    icon: Package,
  },
  {
    label: "Planos",
    href: "#",
    icon: CreditCard,
  },
  {
    label: "Licenciamento",
    href: "#",
    icon: KeyRound,
  },
  {
    label: "Financeiro",
    href: "#",
    icon: CreditCard,
  },
  {
    label: "GED Global",
    href: "#",
    icon: FileText,
  },
  {
    label: "Auditoria",
    href: "/auditoria",
    icon: ShieldCheck,
  },
  {
    label: "Logs",
    href: "#",
    icon: Activity,
  },
  {
    label: "Integrações",
    href: "#",
    icon: Plug,
  },
  {
    label: "Configurações",
    href: "/configuracoes/permissoes",
    icon: Settings,
  },
];

export default function RootSidebar() {
  return (
    <aside
      className="hidden lg:flex w-[280px] bg-slate-950 border-r border-slate-800 flex-col h-dvh overflow-y-auto overscroll-contain sticky top-0"
    >
      <div className="px-6 py-6 border-b border-slate-800">
        <h1 className="text-2xl font-black text-cyan-400">
          GeoFiber
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Platform ROOT
        </p>
      </div>

      <SidebarMenu
        items={items}
        collapsed={false}
        syncSelectionWithPathname
      />

      <SidebarFooter
        name="ROOT"
        role="Administrador da Plataforma"
        email=""
      />
    </aside>
  );
}
