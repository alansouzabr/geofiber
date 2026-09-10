"use client";

import {
  Trash2,
  Palette
} from "lucide-react";

interface Props {

  marker: any;

  setMarkers: any;
}

export default function ContextMenu({

  marker,

  setMarkers

}: Props) {

  function removeItem() {

    setMarkers(
      (prev: any) =>

        prev.filter(
          (item: any) =>

            item.id !==
            marker.id
        )
    );
  }

  return (

    <div
      className="
        flex
        flex-col
        gap-2

        min-w-[180px]
      "
    >

      <button
        className="
          flex
          items-center
          gap-2

          px-3
          py-2

          rounded-lg

          bg-red-500/10

          text-red-400

          hover:bg-red-500/20
        "

        onClick={
          removeItem
        }
      >

        <Trash2 size={14} />

        Excluir

      </button>

      <button
        className="
          flex
          items-center
          gap-2

          px-3
          py-2

          rounded-lg

          bg-cyan-500/10

          text-cyan-300
        "
      >

        <Palette size={14} />

        Cor FTTH

      </button>

    </div>
  );
}
