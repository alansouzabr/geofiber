"use client";
/* ETAPA35A14B_R3_OPTIONAL_PATH_SYNC */

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
} from "lucide-react";

import SidebarMenuGroup from "./SidebarMenuGroup";
import SidebarItemLink from "./SidebarItemLink";

export interface SidebarMenuItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  children?: SidebarMenuItem[];
}

export interface Props {
  items: SidebarMenuItem[];
  collapsed?: boolean;
  syncSelectionWithPathname?: boolean;
}

export default function SidebarMenu({
  items,
  collapsed = false,
  syncSelectionWithPathname = false,
}: Props) {

  const pathname = usePathname();

  const [opened,setOpened]=useState<Record<string,boolean>>(()=>{

    const initial:Record<string,boolean>={};

    items.forEach(item=>{

      if(item.children){

        initial[item.label]=false;

      }

    });

    return initial;

  });

  const [selectedKey,setSelectedKey]=useState<string | null>(null);

  function toggle(label:string){

    setSelectedKey(label);

    setOpened(prev=>{

      const willOpen=!prev[label];

      if(!willOpen){

        return{

          ...prev,

          [label]:false,

        };

      }

      const next:Record<string,boolean>={};

      Object.keys(prev).forEach(key=>{

        next[key]=false;

      });

      next[label]=true;

      return next;

    });

  }

  useEffect(()=>{

    const next:Record<string,boolean>={};

    items.forEach(item=>{

      if(!item.children) return;

      next[item.label]=item.children.some(child=>

        child.href &&
        (
          pathname===child.href ||
          pathname.startsWith(child.href+"/")
        )

      );

    });

    let selected:string|null=null;

    items.forEach(item=>{

      if(

        (item.href &&
          (
            pathname===item.href ||
            pathname.startsWith(item.href+"/")
          )
        )

        ||

        item.children?.some(child=>

          child.href &&
          (
            pathname===child.href ||
            pathname.startsWith(child.href+"/")
          )

        )

      ){

        selected=item.label;

      }

    });

    /*
     * Por padrão a seleção continua
     * controlada somente por clique.
     *
     * ROOT pode sincronizar o estado
     * visual com o pathname.
     */
    if (
      syncSelectionWithPathname
    ) {

      setSelectedKey(
        selected
      );

    }

    setOpened(prev=>({

      ...prev,

      ...next,

    }));

  },[
    pathname,
    items,
    syncSelectionWithPathname,
  ]);

  return (

    <nav className="flex-1 flex flex-col gap-2 px-3">

      {items.map((item)=>{

        const Icon=item.icon;

        const childActive =
          item.children?.some(child =>
            child.href &&
            (
              pathname === child.href ||
              pathname.startsWith(child.href + "/")
            )
          ) ?? false;

        const isOpen =
          opened[item.label] ?? false;

        const expanded =
          childActive ||
          isOpen;

        const active =
          selectedKey===item.label;

        const isHighlighted =
          selectedKey===item.label;

        return(

          <div key={item.label} className="space-y-1">

            {item.href ? (
              <SidebarItemLink
                label={item.label}
                href={item.href!}
                icon={Icon}
                collapsed={collapsed}
                active={active}
                onClick={()=>setSelectedKey(item.label)}
              />



            ) : (

              <SidebarMenuGroup
                label={item.label}
                icon={Icon}
                expanded={expanded}
                highlighted={isHighlighted}
                collapsed={collapsed}
                childrenItems={item.children ?? []}
                selectedKey={selectedKey}
                onToggle={()=>toggle(item.label)}
                onSelect={setSelectedKey}
              />

            )}

          </div>

        );

      })}

    </nav>

  );

}
