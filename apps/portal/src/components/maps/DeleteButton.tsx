"use client";

import {
  Trash2
} from "lucide-react";

interface Props {

  onDelete: () => void;
}

export default function DeleteButton({
  onDelete
}: Props) {

  return (

    <button
      onClick={onDelete}
      className="
        flex
        items-center
        gap-2
        px-4
        py-2
        rounded-xl
        bg-red-500
        hover:bg-red-600
        text-white
        font-semibold
      "
    >

      <Trash2 size={16} />

      Excluir

    </button>
  );
}
