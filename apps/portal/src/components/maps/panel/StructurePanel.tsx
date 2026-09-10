"use client";

import React from "react";
import TreeNode from "@/components/maps/panel/tree/TreeNode";
import type { StructureNode } from "@/components/maps/modules/structure/StructureTypes";

type Item={
  id:string;
  name:string;
  type:string;
};

type Props={
  open:boolean;
  title:string;
  items:StructureNode[];
  onClose:()=>void;
};

function getIcon(type:string){

  switch(type){

    case "POSTE_CONCRETO":
    case "POSTE_METALICO":
      return "◉";

    case "CTO":
      return "🟩";

    case "CEO":
      return "🟨";

    case "SPLITTER":
      return "✳";

    default:
      return "•";

  }

}

export default function StructurePanel({

  open,
  title,
  items,
  onClose

}:Props){

  if(!open){
    return null;
  }

  return (

    <div
      className="
        absolute
        left-8
        top-24
        z-[5000]
        w-[560px]
        rounded-lg
        bg-white
        shadow-2xl
        border
        border-slate-300
        overflow-hidden
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
          bg-fuchsia-700
          text-white
          px-4
          py-3
        "
      >

        <span className="font-semibold">
          {title}
        </span>

        <button
          onClick={onClose}
          className="font-bold"
        >
          ✕
        </button>

      </div>

      <div>

        {
items.map(node=>(

<TreeNode

key={node.id}

node={node}

/>

))
}

      </div>

    </div>

  );

}
