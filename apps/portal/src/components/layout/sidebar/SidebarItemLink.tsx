"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  href: string;
  icon: LucideIcon;
  collapsed: boolean;
  active: boolean;
  onClick: () => void;
}

export default function SidebarItemLink({
  label,
  href,
  icon: Icon,
  collapsed,
  active,
  onClick,
}: Props) {

  return (

    <Link
      href={href}
      onClick={onClick}
      className={`
        flex
        items-center
        gap-3
        rounded-xl
        px-4
        py-3
        transition
        ${
          active
            ? "bg-cyan-600 text-white"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }
      `}
    >

      <Icon size={18}/>

      {!collapsed &&

        <span>{label}</span>

      }

    </Link>

  );

}
