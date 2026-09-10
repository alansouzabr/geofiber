"use client";

import {
  Menu
} from "lucide-react";

export default function MobileToolbar() {

  return (

    <button
      className="
        lg:hidden

        absolute
        top-4
        left-4
        z-50

        w-14
        h-14

        rounded-2xl

        bg-[#020817]/95
        backdrop-blur-xl

        border
        border-cyan-500/20

        flex
        items-center
        justify-center

        text-white
      "
    >

      <Menu size={24} />

    </button>
  );
}
