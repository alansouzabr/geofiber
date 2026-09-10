"use client";
/* ETAPA35A13B_MASTER_MOBILE */

import {
  useContext,
} from "react";

import Link
  from "next/link";

import {
  LogOut,
  X,
} from "lucide-react";

import {
  usePathname,
} from "next/navigation";

import {
  AuthContext,
} from "@/context/AuthContext";

import {
  masterNavigationGroups,
  masterNavigationItemIsActive,
  type MasterNavigationItem,
} from "@/components/master/navigation/masterNavigation";


function MobileNavigationItem({
  item,
  pathname,
  onClose,
  depth = 0,
}: {
  item: MasterNavigationItem;
  pathname: string;
  onClose: () => void;
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

      <div className="space-y-1">

        <div
          className={`
            flex
            items-center
            gap-3
            rounded-xl
            px-3
            py-2.5
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

          <Icon size={16} />

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

              <MobileNavigationItem
                key={child.key}
                item={child}
                pathname={pathname}
                onClose={onClose}
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
      onClick={onClose}
      title={item.description}
      className={`
        flex
        items-center
        gap-3
        rounded-xl
        px-3
        py-3
        text-sm
        transition
        ${
          active
            ? "bg-cyan-500 text-slate-950 font-bold"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }
      `}
      style={{
        marginLeft:
          `${depth * 8}px`
      }}
    >

      <Icon size={17} />

      <span>
        {item.label}
      </span>

    </Link>

  );
}


export default function MasterMobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {

  const pathname =
    usePathname();

  const auth =
    useContext(
      AuthContext
    );

  const user =
    auth?.user ?? null;


  if (!open) {
    return null;
  }


  return (

    <>

      <button
        type="button"
        aria-label="Fechar menu"
        className="
          fixed
          inset-0
          z-[9998]
          bg-black/70
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
          w-[310px]
          max-w-[90vw]
          bg-slate-950
          border-r
          border-slate-800
          p-4
          overflow-y-auto
          lg:hidden
        "
      >

        <div
          className="
            flex
            items-start
            justify-between
            gap-4
            px-2
            pb-5
            mb-5
            border-b
            border-slate-800
          "
        >

          <div>

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
                text-[10px]
                font-bold
                tracking-[0.14em]
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


          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl
              border
              border-slate-700
              p-2
              text-slate-300
              hover:bg-slate-800
              hover:text-white
            "
          >
            <X size={18} />
          </button>

        </div>


        <nav className="space-y-6">

          {masterNavigationGroups.map(
            group => (

              <section
                key={group.key}
              >

                <div
                  className="
                    mb-2
                    px-3
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-slate-500
                  "
                >
                  {group.label}
                </div>


                <div className="space-y-1">

                  {group.items.map(
                    item => (

                      <MobileNavigationItem
                        key={item.key}
                        item={item}
                        pathname={pathname}
                        onClose={onClose}
                      />

                    )
                  )}

                </div>

              </section>

            )
          )}

        </nav>


        <div
          className="
            mt-8
            pt-5
            border-t
            border-slate-800
          "
        >

          <div
            className="
              px-2
              text-sm
              font-semibold
              text-white
            "
          >
            {user?.name ||
              "MASTER"}
          </div>

          <div
            className="
              mt-1
              px-2
              break-all
              text-xs
              text-slate-500
            "
          >
            {user?.email ||
              "GeoFiber Platform"}
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              auth?.logout();
            }}
            className="
              mt-4
              w-full
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-700
              px-4
              py-2.5
              text-sm
              font-semibold
              text-slate-300
              hover:border-red-800
              hover:bg-red-950/30
              hover:text-red-300
              transition
            "
          >

            <LogOut size={16} />
            Sair

          </button>

        </div>

      </aside>

    </>

  );
}
