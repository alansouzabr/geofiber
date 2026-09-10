"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  FolderKanban,
  Radio,
  Server,
  Building2,
  FileText,
  Users,
  LogOut,
  Menu,
} from "lucide-react";

type Item = {
  href: string;
  label: string;
  icon: React.ElementType;
};

const items: Item[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/empresas", label: "Empresas", icon: Building2 },
  { href: "/planos", label: "Planos (SaaS)", icon: FileText },
  { href: "/users", label: "Usuários", icon: Users },
  { href: "/maps", label: "Maps", icon: Map },
];

export default function TopBar({ userName = "Alan" }: { userName?: string }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-fuchsia-900 via-purple-900 to-violet-900">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
            <Map className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">GeoFiber</div>
            <div className="text-[11px] text-white/70">Bem-vindo {userName}</div>
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {items.map((it) => {
            const active =
              pathname === it.href || (it.href !== "/" && pathname?.startsWith(it.href));
            const Icon = it.icon;
            return (
              <Link
                key={it.href}
                href={it.href}
                className={[
                  "group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                  active ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                <Icon className="h-4 w-4 opacity-90" />
                <span>{it.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15 md:inline-flex"
            title="Menu"
          >
            <Menu className="mr-2 h-4 w-4" />
            Menu
          </button>

          <Link
            href="/logout"
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
