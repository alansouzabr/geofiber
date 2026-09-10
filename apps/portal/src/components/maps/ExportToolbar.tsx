"use client";

import {
  Download
} from "lucide-react";

interface Props {

  onExport: () => void;
}

export default function ExportToolbar({
  onExport
}: Props) {

  return (

    <button
      onClick={onExport}
      className="
        absolute
        top-20
        right-5
        z-[9999]
        bg-cyan-500
        hover:bg-cyan-400
        text-slate-950
        font-bold
        rounded-2xl
        px-5
        py-3
        shadow-2xl
        flex
        items-center
        gap-3
        transition-all
      "
    >

      <Download size={18} />

      Exportar Projeto

    </button>
  );
}
