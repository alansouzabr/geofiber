"use client";

import type { Cto } from "./types";

interface Props {
  cto: Cto;
}

export default function CtoItem({
  cto,
}: Props) {
  return (
    <div
      style={{
        paddingLeft: 24,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: 28,
      }}
    >
      <span>{cto.name}</span>

      <div>
        ✏️ 🗑️
      </div>
    </div>
  );
}
