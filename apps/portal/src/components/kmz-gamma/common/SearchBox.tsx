"use client";

import { Search } from "lucide-react";

interface Props{
  placeholder?:string;
}

export default function SearchBox({

  placeholder="Buscar documentos..."

}:Props){

  return(

    <div
      className="
        relative
        w-[420px]
      "
    >

      <input

        placeholder={placeholder}

        className="
          w-full
          rounded-2xl
          border
          border-slate-700
          bg-[#0b1526]
          px-5
          py-4
          pr-14
          text-white
          outline-none
          transition
          focus:border-cyan-500
        "

      />

      <Search

        size={22}

        className="
          absolute
          right-5
          top-1/2
          -translate-y-1/2
          text-slate-400
        "

      />

    </div>

  );

}
