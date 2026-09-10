"use client";
/* ETAPA35A13B_MASTER_SIDEBAR */

import {
  useContext,
  useEffect,
  useState,
} from "react";

import Link
  from "next/link";

import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import {
  usePathname,
} from "next/navigation";

import SidebarFooter
  from "@/components/layout/sidebar/SidebarFooter";

import {
  AuthContext,
} from "@/context/AuthContext";

import {
  masterNavigationGroups,
  masterNavigationItemIsActive,
  type MasterNavigationGroup,
  type MasterNavigationItem,
} from "@/components/master/navigation/masterNavigation";


function NavigationItemNode({
  item,
  pathname,
  depth = 0,
}: {
  item: MasterNavigationItem;
  pathname: string;
  depth?: number;
}) {

  const Icon =
    item.icon;

  const active =
    masterNavigationItemIsActive(
      pathname,
      item
    );

  const children =
    item.children ?? [];


  if (children.length > 0) {

    return (

      <div
        className="space-y-1"
      >

        <div
          title={item.description}
          className={`
            flex
            items-center
            gap-3
            rounded-lg
            px-3
            py-2
            text-sm
            font-semibold
            ${
              active
                ? "text-cyan-300"
                : "text-slate-300"
            }
          `}
          style={{
            marginLeft:
              `${depth * 8}px`
          }}
        >

          <Icon size={15} />

          <span>
            {item.label}
          </span>

        </div>


        <div
          className="
            ml-4
            border-l
            border-slate-800
            pl-3
            space-y-1
          "
        >

          {children.map(
            child => (

              <NavigationItemNode
                key={child.key}
                item={child}
                pathname={pathname}
                depth={depth + 1}
              />

            )
          )}

        </div>

      </div>

    );
  }


  if (!item.href) {
    return null;
  }


  return (

    <Link
      href={item.href}
      title={item.description}
      className={`
        flex
        items-center
        gap-3
        px-3
        py-2.5
        rounded-lg
        text-sm
        transition
        ${
          active
            ? "bg-cyan-500 text-slate-950 font-bold"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }
      `}
      style={{
        marginLeft:
          `${depth * 8}px`
      }}
    >

      <Icon size={16} />

      <span>
        {item.label}
      </span>

    </Link>

  );
}


function NavigationGroup({
  group,
  pathname,
  open,
  onToggle,
}: {
  group: MasterNavigationGroup;
  pathname: string;
  open: boolean;
  onToggle: () => void;
}) {

  const activeChild =
    group.items.some(
      item =>
        masterNavigationItemIsActive(
          pathname,
          item
        )
    );


  return (

    <div className="space-y-1">

      <button
        type="button"
        onClick={onToggle}
        className={`
          w-full
          flex
          items-center
          justify-between
          gap-3
          rounded-xl
          px-3
          py-2.5
          text-sm
          transition
          ${
            activeChild || open
              ? "bg-slate-800 text-white"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }
        `}
      >

        <span className="font-semibold">
          {group.label}
        </span>

        {open ? (
          <ChevronDown size={15} />
        ) : (
          <ChevronRight size={15} />
        )}

      </button>


      {open && (

        <div
          className="
            ml-3
            pl-3
            border-l
            border-slate-800
            space-y-1
          "
        >

          {group.items.map(
            item => (

              <NavigationItemNode
                key={item.key}
                item={item}
                pathname={pathname}
              />

            )
          )}

        </div>

      )}

    </div>

  );
}


export default function MasterSidebar() {

  const pathname =
    usePathname();

  const auth =
    useContext(
      AuthContext
    );

  const user =
    auth?.user ?? null;


  const [
    openGroup,
    setOpenGroup,
  ] =
    useState<string | null>(
      null
    );


  useEffect(() => {

    const activeGroup =
      masterNavigationGroups.find(
        group =>
          group.items.some(
            item =>
              masterNavigationItemIsActive(
                pathname,
                item
              )
          )
      );

    setOpenGroup(
      activeGroup?.key ||
      null
    );

  }, [
    pathname,
  ]);


  return (

    <aside
      className="
        hidden
        lg:flex
        w-[280px]
        bg-slate-950
        border-r
        border-slate-800
        p-4
        flex-col
        shrink-0
        h-dvh
        overflow-y-auto
        overscroll-contain
        sticky
        top-0
      "
    >

      <div
        className="
          mb-7
          px-2
          pb-5
          border-b
          border-slate-800
        "
      >

        <div
          className="
            text-2xl
            font-black
            text-cyan-400
          "
        >
          GEOFIBER
        </div>

        <div
          className="
            mt-2
            text-[11px]
            font-bold
            tracking-[0.16em]
            text-slate-300
          "
        >
          ADMINISTRAÇÃO DA PLATAFORMA
        </div>

        <div
          className="
            mt-1
            text-[10px]
            font-semibold
            tracking-widest
            text-cyan-500
          "
        >
          MASTER
        </div>

      </div>


      <nav
        className="
          flex
          flex-col
          gap-3
          flex-1
        "
      >

        {masterNavigationGroups.map(
          group => (

            <NavigationGroup
              key={group.key}
              group={group}
              pathname={pathname}
              open={
                openGroup ===
                group.key
              }
              onToggle={() =>
                setOpenGroup(
                  current =>
                    current ===
                    group.key
                      ? null
                      : group.key
                )
              }
            />

          )
        )}

      </nav>


      <SidebarFooter
        name={
          user?.name ||
          "MASTER"
        }
        role="Administração da Plataforma"
        email={
          user?.email ||
          ""
        }
      />

    </aside>

  );
}
