"use client";

import { useEffect, useState } from "react";

import {
  subscribeSelection,
  setSelectedNode,
} from "@/components/maps/modules/structure/StructureSelection";

export type TreeNodeData = {
  id: string;
  name: string;
  type: string;
  children?: TreeNodeData[];
};

function icon(type: string) {
  switch (type) {
    case "POSTE_CONCRETO":
    case "POSTE_METALICO":
      return "◉";

    case "CTO":
      return "🟩";

    case "CEO":
      return "🟨";

    case "CLIENT":
      return "👤";

    case "SPLITTER":
      return "✳";

    default:
      return "•";
  }
}

export default function TreeNode({
  node,
}: {
  node: TreeNodeData;
}) {

  const [open, setOpen] = useState(true);

  const [selected, setSelected] = useState(false);

  useEffect(() => {

    return subscribeSelection((id) => {

      setSelected(id === node.id);

    });

  }, [node.id]);

  return (

    <div className="ml-2">

      <div
        className={`flex items-center gap-2 py-1 rounded cursor-pointer hover:bg-slate-100 ${
          selected
            ? "bg-blue-100 border border-blue-400"
            : ""
        }`}
        onClick={() => {

          setOpen(!open);

          setSelectedNode(node.id);

        }}
      >

        <span>

          {node.children?.length
            ? open
              ? "▼"
              : "▶"
            : "•"}

        </span>

        <span>{icon(node.type)}</span>

        <span>{node.name}</span>

      </div>

      {open &&
        node.children?.map((child) => (

          <TreeNode
            key={child.id}
            node={child}
          />

        ))}

    </div>

  );

}
