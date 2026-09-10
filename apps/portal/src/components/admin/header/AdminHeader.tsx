"use client";

import {
  useState
} from "react";

import MobileDrawer from "../mobile/MobileDrawer";

export default function AdminHeader({
  context = "ADMIN",
  name,
  email,
}: {
  context?: "MASTER" | "ADMIN";
  name?: string;
  email?: string;
}) {

  const [drawerOpen, setDrawerOpen] =
    useState(false);

return (

    <>

      <MobileDrawer
        open={drawerOpen}
        onClose={() =>
          setDrawerOpen(false)
        }
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
            onClick={() =>
              setDrawerOpen(true)
            }
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
          >
            ☰
          </button>

          <input
            placeholder="Buscar empresa..."
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
              {name || (context === "ADMIN" ? "ADMIN" : "MASTER")}
            </p>

            <p
              className="
                text-xs
                text-slate-400
              "
            >
              {email || (context === "ADMIN" ? "Administrador" : "MASTER")}
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
            {String(name || (context === "ADMIN" ? "ADMIN" : "MASTER")).trim().charAt(0).toUpperCase()}
          </div>

          

        

</div>

      

</header>

    </>
  );
}
