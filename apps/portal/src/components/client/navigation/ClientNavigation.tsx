"use client";
/* ETAPA35A13B_CLIENT_RECURSIVE_NAVIGATION */

import {
  useContext,
  useState,
} from "react";

import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import {
  AuthContext,
} from "@/context/AuthContext";

import {
  clientNavigation,
  type ClientNavigationChild,
  type ClientNavigationItem,
} from "./clientNavigation";


interface Props {
  tab: string;
  setTab: (tab: string) => void;
  onNavigate?: () => void;
}


export default function ClientNavigation({
  tab,
  setTab,
  onNavigate,
}: Props) {

  const auth =
    useContext(
      AuthContext
    );

  const user =
    auth?.user ?? null;

  const permissions =
    user?.permissions ?? [];


  const isPlatformRole =
    user?.role === "ROOT" ||
    user?.role === "MASTER";


  /*
   * ETAPA35A13B_RBAC
   *
   * ROOT/MASTER:
   * bypass visual de plataforma.
   *
   * ADMIN:
   * sem bypass.
   *
   * module.files exige files.view.
   */
  function hasPermission(
    permissionKey?: string
  ) {

    if (isPlatformRole) {
      return true;
    }

    if (!permissionKey) {
      return true;
    }

    if (
      !permissions.includes(
        permissionKey
      )
    ) {
      return false;
    }

    if (
      permissionKey ===
      "module.files"
    ) {

      return permissions.includes(
        "files.view"
      );
    }

    return true;
  }


  function childIsVisible(
    child: ClientNavigationChild
  ): boolean {

    if (
      child.adminOnly &&
      user?.role !== "ADMIN"
    ) {
      return false;
    }


    if (
      child.platformOnly &&
      !isPlatformRole
    ) {
      return false;
    }


    if (
      !hasPermission(
        child.permissionKey
      )
    ) {
      return false;
    }


    const nested =
      child.children ?? [];


    if (nested.length > 0) {

      return nested.some(
        nestedChild =>
          childIsVisible(
            nestedChild
          )
      );
    }


    return true;
  }


  function itemIsVisible(
    item: ClientNavigationItem
  ): boolean {

    const permissionKey =
      item.permissionKey ??
      (
        item.key.startsWith(
          "module."
        )
          ? item.key
          : undefined
      );


    if (
      !hasPermission(
        permissionKey
      )
    ) {
      return false;
    }


    return item.children.some(
      child =>
        childIsVisible(
          child
        )
    );
  }


  const visibleNavigation =
    clientNavigation.filter(
      item =>
        itemIsVisible(item)
    );


  function childIsActive(
    child: ClientNavigationChild
  ): boolean {

    if (
      child.tab &&
      child.tab === tab
    ) {
      return true;
    }


    return Boolean(
      child.children?.some(
        nested =>
          childIsActive(
            nested
          )
      )
    );
  }


  const [
    openGroups,
    setOpenGroups,
  ] =
    useState<Record<string, boolean>>(
      {}
    );


  function handleGroupClick(
    item: ClientNavigationItem
  ) {

    setTab(
      item.tab
    );

    setOpenGroups(
      current => ({

        ...current,

        [item.key]:
          !(
            current[item.key] ??
            false
          )

      })
    );
  }


  function openChild(
    href?: string,
    childTab?: string
  ) {

    if (childTab) {

      setTab(
        childTab
      );

      onNavigate?.();

      return;
    }


    if (href) {

      window.location.href =
        href;

      return;
    }


    onNavigate?.();
  }


  function renderChild(
    child: ClientNavigationChild,
    depth: number,
    keyPath: string
  ) {

    if (
      !childIsVisible(
        child
      )
    ) {
      return null;
    }


    const ChildIcon =
      child.icon;

    const nested =
      (
        child.children ??
        []
      ).filter(
        nestedChild =>
          childIsVisible(
            nestedChild
          )
      );

    const active =
      childIsActive(
        child
      );


    /*
     * Nó intermediário:
     *
     * Telecomunicação
     * └── Treinamentos
     *     └── TI / Redes / Telecom
     */
    if (nested.length > 0) {

      return (

        <div
          key={keyPath}
          className="space-y-1"
        >

          <div
            className={`
              w-full
              flex
              items-center
              gap-3
              px-3
              py-2
              rounded-lg
              text-left
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

            <ChildIcon size={15} />

            <span>
              {child.label}
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

            {nested.map(
              (
                nestedChild,
                index
              ) =>
                renderChild(
                  nestedChild,
                  depth + 1,
                  `${keyPath}-${index}-${nestedChild.label}`
                )
            )}

          </div>

        </div>

      );
    }


    return (

      <button
        key={keyPath}
        type="button"
        onClick={() =>
          openChild(
            child.href,
            child.tab
          )
        }
        className={`
          w-full
          flex
          items-center
          gap-3
          px-3
          py-2
          rounded-lg
          text-left
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

        <ChildIcon size={15} />

        <span>
          {child.label}
        </span>

      </button>

    );
  }


  return (

    <nav
      className="
        flex
        flex-col
        gap-1
        flex-1
        overflow-y-auto
        pr-1
      "
    >

      {visibleNavigation.map(
        item => {

          const Icon =
            item.icon;


          const active =
            tab === item.tab ||
            item.children.some(
              child =>
                childIsVisible(child) &&
                childIsActive(child)
            );


          const open =
            openGroups[item.key] ??
            active;


          const visibleChildren =
            item.children.filter(
              child =>
                childIsVisible(
                  child
                )
            );


          return (

            <div
              key={item.key}
              className="
                space-y-1
              "
            >

              <button
                type="button"
                onClick={() =>
                  handleGroupClick(item)
                }
                className={`
                  w-full
                  flex
                  items-center
                  justify-between
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  transition-all
                  ${
                    active || open
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >

                <span
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <Icon size={18} />

                  <span>
                    {item.label}
                  </span>

                </span>


                {open ? (

                  <ChevronDown
                    size={16}
                  />

                ) : (

                  <ChevronRight
                    size={16}
                  />

                )}

              </button>


              {open && (

                <div
                  className="
                    ml-3
                    border-l
                    border-slate-800
                    pl-3
                    space-y-1
                  "
                >

                  {visibleChildren.map(
                    (
                      child,
                      index
                    ) =>
                      renderChild(
                        child,
                        0,
                        `${item.key}-${index}-${child.label}`
                      )
                  )}

                </div>

              )}

            </div>

          );
        }
      )}


      {visibleNavigation.length === 0 && (

        <div
          className="
            rounded-xl
            border
            border-slate-800
            bg-slate-900
            p-4
            text-sm
            text-slate-400
          "
        >
          Nenhum módulo liberado
          para esta empresa.
        </div>

      )}

    </nav>

  );
}
