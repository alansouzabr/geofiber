"use client";

import type { Cto } from "./types";
import CtoItem from "./CtoItem";

interface Props {
  items: Cto[];
}

export default function CtoList({
  items,
}: Props) {
  return (
    <>
      {items.map((cto) => (
        <CtoItem
          key={cto.id}
          cto={cto}
        />
      ))}
    </>
  );
}
