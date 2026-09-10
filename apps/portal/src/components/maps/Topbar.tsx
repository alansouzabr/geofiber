"use client";

import {
  Search,
  Globe,
  Layers3,
  Menu
} from "lucide-react";

export default function Topbar() {

  return (

    <header
      className="
        absolute
        top-4
        left-[320px]
        right-[340px]
        z-40

        hidden
        lg:flex

        items-center
        gap-4

        h-[72px]

        px-6

        rounded-3xl

        bg-fuchsia-900/90
        backdrop-blur-xl

        border
        border-fuchsia-500/20

        shadow-2xl
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
          flex-1
          relative
        "
      >

        <Search
          size={18}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-white/70
          "
        />

        <input
          placeholder="
            Buscar endereço...
          "
          className="
            w-full
            h-12
            rounded-2xl
            bg-white/10
            border
            border-white/10
            pl-12
            pr-4
            text-white
            outline-none
          "
        />

      </div>

      <button
        className="
          h-12
          px-4
          rounded-2xl
          bg-cyan-500
          text-black
          font-bold
        "
      >
        KMZ
      </button>

      <button
        className="
          w-12
          h-12
          rounded-2xl
          bg-white/10
          flex
          items-center
          justify-center
        "
      >
        <Layers3 size={18} />
      </button>

      <button
        className="
          w-12
          h-12
          rounded-2xl
          bg-white/10
          flex
          items-center
          justify-center
        "
      >
        <Globe size={18} />
      </button>

    </header>
  );
}
