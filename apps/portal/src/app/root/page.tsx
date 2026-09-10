"use client";

import {
  Building2,
  Users,
  ShieldCheck,
  Settings,
} from "lucide-react";

const cards = [
  {
    title: "Empresas",
    description: "Gerenciamento global das empresas da plataforma.",
    href: "/root/companies",
    icon: Building2,
  },
  {
    title: "Usuários",
    description: "Gerenciamento dos usuários globais.",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Auditoria",
    description: "Acompanhamento das operações da plataforma.",
    href: "/auditoria",
    icon: ShieldCheck,
  },
  {
    title: "Configurações",
    description: "Parâmetros administrativos da plataforma.",
    href: "/configuracoes",
    icon: Settings,
  },
];

export default function RootPage() {
  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
          GeoFiber Platform
        </p>

        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
          Dashboard ROOT
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
          Administração global da plataforma GeoFiber Enterprise.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <a
              key={card.href}
              href={card.href}
              className="
                group
                rounded-2xl
                border
                border-slate-800
                bg-slate-900/70
                p-6
                transition
                hover:border-cyan-500/50
                hover:bg-slate-900
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-cyan-500/10
                  text-cyan-400
                "
              >
                <Icon size={22} />
              </div>

              <h2 className="mt-5 text-lg font-bold text-white">
                {card.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {card.description}
              </p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
