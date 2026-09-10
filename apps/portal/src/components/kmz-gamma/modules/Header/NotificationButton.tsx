"use client";

import { Bell } from "lucide-react";

export default function NotificationButton(){

  return(

    <button
      className="
        relative
        h-12
        w-12
        rounded-xl
        border
        border-slate-700
        bg-[#111c2c]
        flex
        items-center
        justify-center
        hover:bg-[#162235]
        transition
      "
    >

      <Bell
        size={20}
        className="text-slate-300"
      />

      <span
        className="
          absolute
          top-2
          right-2
          h-2
          w-2
          rounded-full
          bg-cyan-400
        "
      />

    </button>

  );

}
