"use client";

import Link from "next/link";

const actions = [
  {
    title: "Projetos",
    href: "/projetos",
  },
  {
    title: "Arquivos",
    href: "/arquivos",
  },
  {
    title: "Empresa",
    href: "/usuarios",
  },
  {
    title: "Financeiro",
    href: "/financeiro",
  },
];

export default function HeroActions() {
  return (
    <div
      className="
        mt-8
        flex
        flex-wrap
        gap-3
      "
    >
      {actions.map((action) => (
        <Link
          key={action.title}
          href={action.href}
          className="
            rounded-xl
            border
            border-slate-700
            bg-slate-900
            px-5
            py-3
            text-sm
            text-white
            transition-all
            duration-300
            hover:border-cyan-500
          "
        >
          {action.title}
        </Link>
      ))}
    </div>
  );
}
