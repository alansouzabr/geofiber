"use client";

import { useState } from "react";

import RootMobileDrawer from "@/components/root/mobile/RootMobileDrawer";

export default function RootHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <RootMobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <header
        className="
          h-auto
          min-h-[80px]
          border-b
          border-slate-800
          bg-[#020817]
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-end
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
            w-full
          "
        >
          <button
            onClick={() => setDrawerOpen(true)}
            className="
              lg:hidden
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              px-3
              py-2
              text-white
            "
            aria-label="Abrir menu"
          >
            ☰
          </button>

          <input
            placeholder="Buscar na Plataforma..."
            className="
              w-full
              lg:w-[320px]
              bg-slate-900
              border
              border-slate-700
              rounded-xl
              px-4
              py-3
              outline-none
              text-sm
            "
          />
        </div>

        <div
          className="
            flex
            items-center
            lg:justify-end
            gap-3
            w-full
            lg:w-auto
          "
        >
          <div
            className="
              block
              text-right
            "
          >
            <p
              className="
                text-sm
                font-semibold
                text-white
              "
            >
              ROOT PLATFORM
            </p>

            <p
              className="
                text-xs
                text-slate-400
              "
            >
              Administrador da Plataforma
            </p>
          </div>

          <div
            className="
              w-11
              h-11
              rounded-full
              bg-cyan-500
              flex
              items-center
              justify-center
              font-bold
              text-slate-950
              shrink-0
            "
          >
            R
          </div>
        </div>
      </header>
    </>
  );
}
