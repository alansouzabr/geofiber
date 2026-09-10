"use client";

import { ReactNode } from "react";

interface Props{
  children:ReactNode;
  className?:string;
}

export default function Card({

  children,

  className=""

}:Props){

  return(

    <div

      className={`
        rounded-[26px]
        border
        border-white/10
        overflow-hidden
        transition-all
        duration-300
        shadow-2xl
        hover:-translate-y-1
        hover:shadow-[0_0_40px_rgba(0,255,255,.08)]
        ${className}
      `}

    >

      {children}

    </div>

  );

}
