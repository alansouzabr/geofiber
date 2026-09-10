"use client";
/* ETAPA35A14B_R3_ROOT_MOBILE_ACTIVE */

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  CreditCard,
  ShieldCheck,
  FileText,
  Settings,
  Activity,
  Plug,
  KeyRound,
} from "lucide-react";

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

export default function RootMobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {

  const pathname =
    usePathname();
  if (!open) {
    return null;
  }

  return (
    <>
      <div
        className="
          fixed
          inset-0
          z-[9998]
          bg-black/60
          lg:hidden
        "
        onClick={onClose}
      />

      <aside
        className="
          fixed
          inset-y-0
          left-0
          z-[9999]
          w-[290px]
          max-w-[88vw]
          bg-slate-950
          border-r
          border-slate-800
          p-4
          overflow-y-auto
          lg:hidden
        "
      >
        <div className="mb-7 px-2">
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
              mt-1
              text-xs
              text-slate-500
            "
          >
            Enterprise SaaS
          </p>

          <p
            className="
              mt-1
              text-xs
              text-slate-300
            "
          >
            GeoFiber Platform
          </p>

          <p
            className="
              text-[10px]
              text-slate-500
            "
          >
            ROOT
          </p>
        </div>

        <nav
          className="
            flex
            flex-col
            gap-2
          "
        >
          {items.map((item) => {
            const Icon = item.icon;


            const active =
              item.href !== "#" &&
              (
                item.href === "/root"
                  ? pathname === "/root"
                  : (
                      pathname === item.href ||
                      pathname.startsWith(
                        item.href + "/"
                      )
                    )
              );

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  text-sm
                  transition
                  ${
                    active
                      ? "bg-cyan-500 text-slate-950 font-bold"
                      : "font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                <Icon size={17} />

                <span>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div
          className="
            mt-8
            border-t
            border-slate-800
            pt-5
          "
        >
          <p
            className="
              px-2
              text-[11px]
              text-slate-500
            "
          >
            GeoFiber Platform
          </p>
        </div>
      </aside>
    </>
  );
}
