"use client";

import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
} from "lucide-react";

import SidebarMenuChild from "./SidebarMenuChild";
import type { SidebarMenuItem } from "./SidebarMenu";

interface Props {
  label: string;
  icon: LucideIcon;
  expanded: boolean;
  highlighted: boolean;
  collapsed: boolean;
  childrenItems: SidebarMenuItem[];
  selectedKey: string | null;
  onToggle: () => void;
  onSelect: (key:string)=>void;
}

export default function SidebarMenuGroup({
  label,
  icon: Icon,
  expanded,
  highlighted,
  collapsed,
  childrenItems,
  selectedKey,
  onToggle,
  onSelect,
}:Props){

  return(

    <>

      <button
        type="button"
        onClick={onToggle}
        className={`
          w-full
          flex
          items-center
          justify-between
          rounded-xl
          px-4
          py-3
          transition
          ${
            highlighted
              ? "bg-cyan-600 text-white"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
          }
        `}
      >

        <div className="flex items-center gap-3">

          <Icon size={18}/>

          {!collapsed &&

            <span>{label}</span>

          }

        </div>

        {!collapsed && (

          expanded
            ? <ChevronDown size={16}/>
            : <ChevronRight size={16}/>

        )}

      </button>

      {

        !collapsed &&
        expanded &&

        childrenItems.map(child=>{

          if(!child.href){

            return null;

          }

          return(

            <SidebarMenuChild
              key={child.label}
              label={child.label}
              href={child.href}
              icon={child.icon}
              selected={selectedKey===child.label}
              onClick={()=>onSelect(child.label)}
            />

          );

        })

      }

    </>

  );

}
