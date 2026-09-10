"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function PrimaryButton({
  children,
  className="",
  onClick
}: Props){

  return (

    <button
      onClick={onClick}
      className={`
        w-full
        rounded-xl
        px-6
        py-4
        font-semibold
        transition
        bg-cyan-500
        hover:bg-cyan-400
        text-slate-950
        ${className}
      `}
    >

      {children}

    </button>

  );

}
