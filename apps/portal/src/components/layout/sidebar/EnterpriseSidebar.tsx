"use client";
/* ETAPA35A13E_R1_SIDEBAR */

import { useContext, useMemo, useState } from "react";

import Link from "next/link";
import { PanelLeft } from "lucide-react";
import { sidebarItems } from "./sidebarItems";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";
import { AuthContext } from "@/context/AuthContext";



export default function EnterpriseSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;

  const isPlatformRole =
    user?.role === "ROOT" ||
    user?.role === "MASTER";

  const userPermissions = user?.permissions ?? [];

  const hasPermission = (
    permission?: string,
    platformOnly?: boolean
  ) => {
    if (isPlatformRole) {
      return true;
    }

    if (platformOnly) {
      return false;
    }

    if (!permission) {
      return true;
    }

    return userPermissions.includes(permission);
  };

  const filteredSidebarItems = useMemo(() => {
    function filterItems(items: typeof sidebarItems) {
      return items
        .map((item) => {
          const children = item.children
            ? filterItems(item.children)
            : undefined;

          const ownAccess = hasPermission(
            item.perm,
            item.platformOnly
          );

          const hasVisibleChildren =
            !!children && children.length > 0;

          if (!ownAccess && !hasVisibleChildren) {
            return null;
          }

          return {
            ...item,
            ...(children
              ? { children }
              : {}),
          };
        })
        .filter(
          (
            item
          ): item is NonNullable<typeof item> =>
            item !== null
        );
    }

    return filterItems(sidebarItems);
  }, [
    isPlatformRole,
    userPermissions.join("|"),
  ]);

  return (
    <aside
      className={`hidden lg:flex bg-slate-950 border-r border-slate-800 transition-all duration-300 flex-col ${collapsed ? "w-[76px]" : "w-[280px]"} h-dvh overflow-y-auto overscroll-contain sticky top-0`}
    >

      <div
        className="
          flex
          items-center
          justify-end
          px-4
          py-4
          border-b
          border-slate-800
        "
      >

        <button
          title={
            collapsed
              ? "Abrir barra lateral"
              : "Fechar barra lateral"
          }
          onClick={() => setCollapsed(!collapsed)}
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
          <PanelLeft
            size={22}
            strokeWidth={2.2}
          />
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
        items={filteredSidebarItems}
        collapsed={collapsed}
      />

      <SidebarFooter
        collapsed={collapsed}
        name={
          user?.name ||
          user?.email ||
          "Usuário"
        }
        role={
          user?.role ||
          "Usuário"
        }
        email={
          user?.email ||
          ""
        }
      />

    </aside>
  );
}

