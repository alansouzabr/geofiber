"use client";

import CtoList from "./CtoList";
import type { Cto } from "./types";

interface Props {
  items: Cto[];
}

export default function CtoModule({
  items,
}: Props) {
  return (
    <CtoList items={items} />
  );
}
