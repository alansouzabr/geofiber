"use client";

import {
  Undo2,
  Redo2
} from "lucide-react";

interface Props {

  onUndo: () => void;

  onRedo: () => void;
}

export default function HistoryToolbar({
  onUndo,
  onRedo
}: Props) {

  return (

    <div
      className="
        absolute
        top-5
        right-5
        z-[9999]
        flex
        gap-3
      "
    >

      <button
        onClick={onUndo}
        className="
          bg-slate-950
          border
          border-slate-800
          rounded-xl
          px-4
          py-3
          hover:bg-slate-900
          transition-all
        "
      >

        <Undo2
          className="
            text-cyan-400
          "
          size={18}
        />

      </button>

      <button
        onClick={onRedo}
        className="
          bg-slate-950
          border
          border-slate-800
          rounded-xl
          px-4
          py-3
          hover:bg-slate-900
          transition-all
        "
      >

        <Redo2
          className="
            text-cyan-400
          "
          size={18}
        />

      </button>

    </div>
  );
}
