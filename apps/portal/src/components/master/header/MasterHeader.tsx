"use client";

import {
  useContext,
  useState,
} from "react";

import {
  LogOut,
  Menu,
  ShieldCheck,
} from "lucide-react";

import MasterMobileDrawer
  from "../mobile/MobileDrawer";

import {
  AuthContext,
} from "@/context/AuthContext";

export default function MasterHeader() {

  const [
    drawerOpen,
    setDrawerOpen,
  ] =
    useState(false);

  const auth =
    useContext(AuthContext);

  const user =
    auth?.user ?? null;

  const displayName =
    user?.name?.trim() ||
    "MASTER";

  const email =
    user?.email ||
    "GeoFiber Platform";

  const initial =
    displayName
      .charAt(0)
      .toUpperCase() ||
    "M";

  return (
    <>

      <MasterMobileDrawer
        open={drawerOpen}
        onClose={() =>
          setDrawerOpen(false)
        }
      />

      <header
        className="
          sticky
          top-0
          z-40
          min-h-[78px]
          border-b
          border-slate-800
          bg-[#020817]/95
          backdrop-blur
          flex
          items-center
          justify-between
          gap-4
          px-4
          lg:px-8
          py-4
        "
      >

        <div
          className="
            flex
            items-center
            gap-3
            min-w-0
          "
        >

          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() =>
              setDrawerOpen(true)
            }
            className="
              lg:hidden
              rounded-xl
              border
              border-slate-700
              bg-slate-900
              p-2.5
              text-white
            "
          >
            <Menu size={19} />
          </button>

          <div
            className="
              hidden
              sm:flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-cyan-500/10
              text-cyan-400
            "
          >
            <ShieldCheck
              size={21}
            />
          </div>

          <div className="min-w-0">

            <div
              className="
                text-sm
                font-black
                tracking-wide
                text-white
              "
            >
              Administração da Plataforma
            </div>

            <div
              className="
                mt-0.5
                text-xs
                text-slate-500
              "
            >
              GeoFiber Enterprise SaaS
            </div>

          </div>

        </div>

        <div
          className="
            flex
            items-center
            gap-3
            min-w-0
          "
        >

          <div
            className="
              hidden
              sm:block
              min-w-0
              text-right
            "
          >

            <div
              className="
                truncate
                text-sm
                font-semibold
                text-white
              "
            >
              {displayName}
            </div>

            <div
              className="
                max-w-[260px]
                truncate
                text-xs
                text-slate-500
              "
            >
              {email}
            </div>

          </div>

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-cyan-500
              font-black
              text-slate-950
            "
          >
            {initial}
          </div>

          <button
            type="button"
            title="Sair"
            onClick={() =>
              auth?.logout()
            }
            className="
              hidden
              sm:flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-slate-700
              text-slate-400
              transition
              hover:border-red-900
              hover:bg-red-950/30
              hover:text-red-300
            "
          >
            <LogOut
              size={17}
            />
          </button>

        </div>

      </header>

    </>
  );
}
