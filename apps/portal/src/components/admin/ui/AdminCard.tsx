import { ReactNode } from "react";

interface Props {

  children: ReactNode;

  className?: string;

}

export default function AdminCard({

  children,

  className=""

}: Props){

  return(

    <div
      className={`
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        shadow-sm
        p-6
        ${className}
      `}
    >

      {children}

    </div>

  );

}
