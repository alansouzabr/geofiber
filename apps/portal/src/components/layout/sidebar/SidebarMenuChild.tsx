"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  href: string;
  icon: LucideIcon;
  selected: boolean;
  onClick: () => void;
}

export default function SidebarMenuChild({
  label,
  href,
  icon: Icon,
  selected,
  onClick,
}: Props) {

  return (

    <Link
      href={href}
      onClick={onClick}
      className={`
        ml-6
        flex
        items-center
        gap-3
        rounded-lg
        px-3
        py-2
        text-sm
        transition
        ${
          selected
            ? "bg-cyan-700 text-white"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }
      `}
    >

      <Icon size={16} />

      {label}

    </Link>

  );

}
