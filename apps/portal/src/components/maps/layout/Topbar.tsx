"use client";

import {
  Search,
  Layers3,
  Bell,
  Menu
} from "lucide-react";

export default function Topbar() {

  return (

    <header
      className="
        absolute
        top-0
        left-0
        right-0

        z-[1000]

        h-14

        flex
        items-center
        justify-between

        px-4

        bg-[#7e008c]/95
        backdrop-blur-xl

        border-b
        border-white/10
      "
    >

      <div
        className="
          flex
          items-center
          gap-4
        "
      >

        <div
          className="
            text-white
            font-black
            text-xl
          "
        >

          GeoFiber Maps

        </div>

        <div
          className="
            hidden
            md:flex

            items-center
            gap-2

            bg-white/10

            px-3
            py-2

            rounded-xl
          "
        >

          <Search size={16} />

          <input
            placeholder="Pesquisar endereço"
            className="
              bg-transparent
              outline-none

              text-sm
              text-white

              placeholder:text-white/60
            "
          />

        </div>

      </div>

      <div
        className="
          flex
          items-center
          gap-3

          text-white
        "
      >

        <Layers3 size={18} />

        <Bell size={18} />

        <Menu size={18} />

      </div>

    </header>
  );
}
